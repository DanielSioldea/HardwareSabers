/**
 * Conversion factors from a model's native unit → metres (Three.js native unit).
 * The scene renders in metres; all GLB geometry is scaled on placement.
 *
 *   modelUnit: 'in'  → ×0.0254   (1 inch  = 0.0254 m)
 *   modelUnit: 'ft'  → ×0.3048   (1 foot  = 0.3048 m)
 *   modelUnit: 'm'   → ×1        (no change)
 *   modelUnit: 'cm'  → ×0.01
 *   modelUnit: 'mm'  → ×0.001
 *
 * Position values shown in the Properties panel are converted to inches
 * for display (see TransformPanel.jsx) but stored in metres in the store.
 */
const SCALES = {
  in: 0.0254,
  ft: 0.3048,
  m:  1,
  cm: 0.01,
  mm: 0.001,
};

export function getUnitScale(unit) {
  return SCALES[unit?.toLowerCase()] ?? 1;
}
