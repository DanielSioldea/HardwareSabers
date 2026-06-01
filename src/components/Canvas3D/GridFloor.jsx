import React from 'react';
import { Grid } from '@react-three/drei';

/**
 * Reference grid in metres (1 scene unit = 1 metre).
 * Minor lines every 10 cm; major lines every 1 m.
 */
export default function GridFloor() {
  return (
    <>
      <Grid
        position={[0, -0.001, 0]}
        args={[30, 30]}
        cellSize={0.1}
        cellThickness={0.5}
        cellColor="#4a4a5a"
        sectionSize={1.0}
        sectionThickness={1.0}
        sectionColor="#6060a0"
        fadeDistance={25}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* World-origin axis markers (2 m each) */}
      <group>
        <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 2, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 2, 8]} />
          <meshBasicMaterial color="#4488ff" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 2, 8]} />
          <meshBasicMaterial color="#44cc44" />
        </mesh>
      </group>
    </>
  );
}
