/**
 * Module-level registry mapping scene component IDs to their
 * Three.js Group refs. Populated by HiltComponent on mount/unmount.
 *
 * This avoids storing mutable refs inside Zustand (anti-pattern)
 * while still giving the surface-mate logic direct Object3D access.
 */
export const componentRefs = new Map(); // id (string) → THREE.Group

/** Register a component's Three.js object. Called from HiltComponent. */
export function registerRef(id, object3d) {
  componentRefs.set(id, object3d);
}

/** Unregister when the component is removed from the scene. */
export function unregisterRef(id) {
  componentRefs.delete(id);
}

/** Get the Three.js object for a given component ID (may be undefined). */
export function getRef(id) {
  return componentRefs.get(id);
}
