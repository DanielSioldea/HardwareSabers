import React, { useRef, useEffect, useState, Suspense } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import { registerRef, unregisterRef } from '../../utils/componentRefs';
import { worldNormalFromIntersection, worldPointToLocal } from '../../utils/surfaceMate';

// ─── Placeholder box shown when no GLB is wired up ──────────────────────────

function PlaceholderBox({ size, color }) {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
    </mesh>
  );
}

// ─── GLB model loader ────────────────────────────────────────────────────────

function GLBModel({ path, color }) {
  const { scene } = useGLTF(path);

  const cloned = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      const applyColor = (mat) => { const m = mat.clone(); m.color.set(color); return m; };
      child.material = Array.isArray(child.material)
        ? child.material.map(applyColor)
        : applyColor(child.material);
    });
    return clone;
  }, [scene, color]);

  return <primitive object={cloned} castShadow receiveShadow />;
}

// Error boundary — falls back to a placeholder if the GLB can't be loaded
class ModelErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: false }; }
  componentDidCatch() { this.setState({ error: true }); }
  render() {
    if (this.state.error)
      return <PlaceholderBox size={this.props.size} color={this.props.color} />;
    return this.props.children;
  }
}

// ─── Surface-highlight disc shown in mate mode ───────────────────────────────

function FaceHighlight({ point, normal, color }) {
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal.clone().normalize()
  );
  return (
    <mesh position={point} quaternion={quaternion} renderOrder={999}>
      <circleGeometry args={[0.08, 32]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.75} depthTest={false} />
    </mesh>
  );
}

// ─── Main HiltComponent ──────────────────────────────────────────────────────

export default function HiltComponent({ data, orbitRef }) {
  const groupRef    = useRef();
  const transformRef = useRef();

  const {
    selectedComponentId, selectComponent,
    mateMode, setMateSurface, mateState,
    updateComponentTransform,
    transformMode,
  } = useStore();

  const isSelected = selectedComponentId === data.id;

  // ── Register / deregister in the global Three.js object map ─────────────
  useEffect(() => {
    if (groupRef.current) registerRef(data.id, groupRef.current);
    return () => unregisterRef(data.id);
  }, [data.id]);

  // ── Sync store → Three.js ────────────────────────────────────────────────
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.set(...data.position);
    g.rotation.set(...data.rotation);
    g.scale.set(...data.scale);
  }, [data.position, data.rotation, data.scale]);

  // ── Sync Three.js → store when TransformControls finishes dragging ───────
  function handleObjectChange() {
    const g = groupRef.current;
    if (!g) return;
    const euler = new THREE.Euler().setFromQuaternion(g.quaternion);
    updateComponentTransform(
      data.id,
      g.position.toArray(),
      [euler.x, euler.y, euler.z],
      g.scale.toArray()
    );
  }

  function handlePointerDown(event) {
    event.stopPropagation();
  }

  // Stops click from bubbling to the GroundPlane (which calls deselectAll).
  function handleClick(event) {
    event.stopPropagation();
    if (mateMode) {
      const intersection = event.intersections?.[0];
      if (!intersection?.face) return;
      const worldNormal = worldNormalFromIntersection(intersection);
      const worldPoint  = intersection.point.clone();
      const localPoint  = worldPointToLocal(groupRef.current, worldPoint);
      setMateSurface({
        componentId: data.id,
        worldPoint:  worldPoint.toArray(),
        worldNormal: worldNormal.toArray(),
        localPoint:  localPoint.toArray(),
      });
    } else {
      selectComponent(data.id);
    }
  }

  const isMateA  = mateState.surfaceA?.componentId === data.id;
  const isMateB  = mateState.surfaceB?.componentId === data.id;
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <group
        ref={groupRef}
        name={`hilt-${data.id}`}
        userData={{ componentId: data.id, componentType: data.type }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Selection highlight */}
        {(isSelected || hovered) && !mateMode && (
          <mesh scale={[1.02, 1.02, 1.02]}>
            <boxGeometry args={data.placeholderSize || [0.5, 0.5, 0.5]} />
            <meshBasicMaterial
              color={isSelected ? '#4fc3f7' : '#aaaaff'}
              transparent opacity={0.15}
              side={THREE.FrontSide} depthTest={false}
            />
          </mesh>
        )}

        {/* Mate-mode hover indicator */}
        {mateMode && hovered && (
          <mesh scale={[1.05, 1.05, 1.05]}>
            <boxGeometry args={data.placeholderSize || [0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} depthTest={false} />
          </mesh>
        )}

        {/* Actual geometry */}
        {data.glbPath ? (
          <ModelErrorBoundary size={data.placeholderSize || [0.5, 0.5, 0.5]} color={data.color}>
            <Suspense fallback={<PlaceholderBox size={data.placeholderSize || [0.5, 0.5, 0.5]} color={data.color} />}>
              <GLBModel path={data.glbPath} color={data.color} />
            </Suspense>
          </ModelErrorBoundary>
        ) : (
          <PlaceholderBox size={data.placeholderSize || [0.5, 0.5, 0.5]} color={data.color} />
        )}
      </group>

      {/* Face highlight discs for surface mating */}
      {isMateA && mateState.surfaceA && (
        <FaceHighlight
          point={new THREE.Vector3(...mateState.surfaceA.worldPoint)}
          normal={new THREE.Vector3(...mateState.surfaceA.worldNormal)}
          color="#4488ff"
        />
      )}
      {isMateB && mateState.surfaceB && (
        <FaceHighlight
          point={new THREE.Vector3(...mateState.surfaceB.worldPoint)}
          normal={new THREE.Vector3(...mateState.surfaceB.worldNormal)}
          color="#ff8844"
        />
      )}

      {/* TransformControls gizmo */}
      {isSelected && !mateMode && groupRef.current && (
        <TransformControls
          ref={transformRef}
          object={groupRef.current}
          mode={transformMode}
          onObjectChange={handleObjectChange}
          size={0.7}
        />
      )}
    </>
  );
}
