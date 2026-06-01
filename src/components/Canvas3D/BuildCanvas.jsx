import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';
import Scene from './Scene';

/**
 * Wraps the React Three Fiber <Canvas>.
 * Components are added via clicks in the ComponentLibrary sidebar (not drag-and-drop).
 * CAD-like view controls are managed inside Scene via OrbitControls.
 */
export default function BuildCanvas() {
  const canvasWrapperRef = useRef();
  const { mateMode } = useStore();

  return (
    <div
      ref={canvasWrapperRef}
      className={`canvas-wrapper ${mateMode ? 'mate-cursor' : ''}`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 3, 5], fov: 50, near: 0.01, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Scene />
      </Canvas>

      {/* Mate mode cursor hint */}
      {mateMode && (
        <div className="mate-hint">
          Mate mode — click a face on each component to align them
        </div>
      )}
    </div>
  );
}
