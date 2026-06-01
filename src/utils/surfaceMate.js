import * as THREE from 'three';

/**
 * Applies a surface-mate transform to `objA` so that the picked
 * face on A aligns flush with (and opposite to) the picked face on B.
 *
 * Algorithm:
 *  1. Compute rotation R that maps normalA → -normalB  (faces meet head-on)
 *  2. Pre-multiply R onto objA's world quaternion (rotation around own centre)
 *  3. Update objA's world matrix so localPointA can be re-projected
 *  4. Translate objA so the contact point on A lands exactly on contact point B
 *
 * @param {THREE.Object3D} objA         - The object to move (component A)
 * @param {THREE.Vector3}  localPointA  - Face hit point in objA's local space
 * @param {THREE.Vector3}  worldNormalA - Face normal of A in world space
 * @param {THREE.Vector3}  worldPointB  - Face hit point of B in world space
 * @param {THREE.Vector3}  worldNormalB - Face normal of B in world space
 * @returns {{ position: number[], rotation: number[], scale: number[] }}
 *          New transform values to persist back to the Zustand store.
 */
export function applyMate(objA, localPointA, worldNormalA, worldPointB, worldNormalB) {
  // ── Step 1: rotation that aligns normalA onto the reverse of normalB ────
  const targetNormal = worldNormalB.clone().negate().normalize();
  const srcNormal = worldNormalA.clone().normalize();

  // Guard against degenerate case (normals already aligned or exactly opposite)
  const dot = srcNormal.dot(targetNormal);
  const R = new THREE.Quaternion();
  if (Math.abs(dot + 1) < 1e-6) {
    // Normals are exactly antiparallel → no rotation needed
    R.identity();
  } else if (Math.abs(dot - 1) < 1e-6) {
    // Normals are exactly parallel → rotate 180° around an arbitrary axis
    const axis = new THREE.Vector3(1, 0, 0);
    if (Math.abs(srcNormal.dot(axis)) > 0.9) axis.set(0, 1, 0);
    R.setFromAxisAngle(axis, Math.PI);
  } else {
    R.setFromUnitVectors(srcNormal, targetNormal);
  }

  // ── Step 2: apply R to objA's quaternion in world space ─────────────────
  // Pre-multiplying rotates objA around its own world-space centre.
  // If objA's parent is the scene (identity transform), this is direct.
  const worldQuat = new THREE.Quaternion();
  objA.getWorldQuaternion(worldQuat);
  worldQuat.premultiply(R);

  // Convert world quaternion back to local (parent-relative).
  // For scene-root objects the parent quaternion is identity, so this is a no-op.
  const parentQuat = new THREE.Quaternion();
  if (objA.parent) objA.parent.getWorldQuaternion(parentQuat);
  objA.quaternion.copy(parentQuat.invert().multiply(worldQuat));

  // Recompute matrices so localToWorld gives the post-rotation result
  objA.updateMatrix();
  objA.updateWorldMatrix(false, false);

  // ── Step 3: find where localPointA ended up in world space ──────────────
  const newWorldPointA = localPointA.clone().applyMatrix4(objA.matrixWorld);

  // ── Step 4: translate objA so the contact points coincide ───────────────
  const delta = worldPointB.clone().sub(newWorldPointA);
  objA.position.add(delta);
  objA.updateMatrix();

  // ── Return values to persist in the Zustand store ───────────────────────
  const euler = new THREE.Euler().setFromQuaternion(objA.quaternion);
  return {
    position: objA.position.toArray(),
    rotation: [euler.x, euler.y, euler.z],
    scale: objA.scale.toArray(),
  };
}

/**
 * Convert a face-hit intersection to a world-space normal.
 * The intersection's face.normal is in local (object) space;
 * we transform it with the object's normalMatrix to get world space.
 */
export function worldNormalFromIntersection(intersection) {
  const localNormal = intersection.face.normal.clone();
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersection.object.matrixWorld);
  return localNormal.applyMatrix3(normalMatrix).normalize();
}

/**
 * Convert the world-space hit point to the component root's local space.
 * We traverse up to find the root Group (the one registered in componentRefs).
 */
export function worldPointToLocal(rootObject, worldPoint) {
  return rootObject.worldToLocal(worldPoint.clone());
}
