import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import HiltComponent from './HiltComponent';
import GridFloor from './GridFloor';
import { cameraRef, glRef } from '../../utils/cameraRef';
import { getRef } from '../../utils/componentRefs';
import { applyMate } from '../../utils/surfaceMate';

/**
 * Captures the R3F camera and renderer into module-level refs so that
 * outside-canvas code (drop handler) can access them for unprojection.
 */
function CameraCapture() {
  const { camera, gl } = useThree();
  useEffect(() => {
    cameraRef.current = camera;
    glRef.current = gl;
  }, [camera, gl]);
  return null;
}

/**
 * Invisible ground plane used as a drop target — catches rays cast from
 * the drop position so we know where in 3D to place the dropped component.
 * Also used to deselect when clicking empty space.
 */
function GroundPlane({ onClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      visible={false}
      onClick={onClick}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial />
    </mesh>
  );
}

/**
 * The main R3F scene content.
 * Handles:
 *  - All placed HiltComponent instances
 *  - OrbitControls (CAD-like: orbit, pan, zoom)
 *  - Lighting
 *  - Apply-Mate event listener (triggered from the TransformPanel button)
 */
export default function Scene() {
  const orbitRef = useRef();

  const {
    sceneComponents,
    deselectAll,
    mateState,
    clearMateState,
    toggleMateMode,
    updateComponentTransform,
  } = useStore();

  // ── Listen for the "Apply Mate" event dispatched from TransformPanel ──────
  useEffect(() => {
    function onApplyMate() {
      const { surfaceA, surfaceB } = useStore.getState().mateState;
      if (!surfaceA || !surfaceB) return;

      const objA = getRef(surfaceA.componentId);
      if (!objA) return;

      // Reconstruct Three.js vectors from stored arrays
      const localPointA  = new THREE.Vector3(...surfaceA.localPoint);
      const worldNormalA = new THREE.Vector3(...surfaceA.worldNormal);
      const worldPointB  = new THREE.Vector3(...surfaceB.worldPoint);
      const worldNormalB = new THREE.Vector3(...surfaceB.worldNormal);

      // Apply the surface-mate transformation (mutates objA in-place)
      const newTransform = applyMate(objA, localPointA, worldNormalA, worldPointB, worldNormalB);

      // Persist back to the store so the panel inputs and future drags stay in sync
      updateComponentTransform(
        surfaceA.componentId,
        newTransform.position,
        newTransform.rotation,
        newTransform.scale
      );

      clearMateState();
      toggleMateMode();
    }

    window.addEventListener('applyMate', onApplyMate);
    return () => window.removeEventListener('applyMate', onApplyMate);
  }, [clearMateState, toggleMateMode, updateComponentTransform]);

  return (
    <>
      {/* ── Camera utility ─────────────────────────────────────────── */}
      <CameraCapture />

      {/* ── CAD-style orbit controls ────────────────────────────────
           - Left drag  → orbit (rotate view)
           - Middle drag → pan
           - Scroll     → zoom
           - Right drag → pan (alternative)
           makeDefault publishes controls to the R3F context so
           TransformControls can disable them when dragging a gizmo. */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        minDistance={0.5}
        maxDistance={50}
        enableDamping
        dampingFactor={0.07}
        screenSpacePanning
        target={[0, 0.5, 0]}
      />

      {/* ── Scene lighting ──────────────────────────────────────────── */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.4} />
      <directionalLight position={[0, -3, 0]} intensity={0.15} />

      {/* ── Environment fog ────────────────────────────────────────── */}
      <fog attach="fog" args={['#0d1117', 20, 60]} />

      {/* ── Reference grid ─────────────────────────────────────────── */}
      <GridFloor />

      {/* ── Drop target / deselect plane ───────────────────────────── */}
      <GroundPlane onClick={() => deselectAll()} />

      {/* ── Placed hilt components ─────────────────────────────────── */}
      {sceneComponents.map((comp) => (
        <HiltComponent key={comp.id} data={comp} orbitRef={orbitRef} />
      ))}
    </>
  );
}
