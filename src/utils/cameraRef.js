/**
 * Module-level reference to the active R3F camera.
 * Populated by CameraCapture inside the canvas so that
 * outside-canvas code (e.g. drop handlers) can access it
 * for world-space unprojection.
 */
export const cameraRef = { current: null };

/**
 * Module-level reference to the R3F renderer's GL context,
 * used to compute canvas-relative NDC coordinates on drop.
 */
export const glRef = { current: null };

/**
 * Given a mouse event on the canvas element, returns normalised
 * device coordinates (NDC) in the range [-1, 1] for both axes.
 */
export function eventToNDC(event, canvasElement) {
  const rect = canvasElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return { x, y };
}
