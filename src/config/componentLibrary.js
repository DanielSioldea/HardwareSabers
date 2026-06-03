/**
 * ============================================================
 * COMPONENT LIBRARY CONFIGURATION
 * ============================================================
 *
 * This file defines the hilt components available in the
 * left-side component library panel.
 *
 * HOW TO ADD YOUR OWN GLB MODELS:
 * ─────────────────────────────────────────────────────────────
 * 1. Copy your .glb files into: public/models/
 *    Example: public/models/pommel.glb
 *
 * 2. Set the `glbPath` for the corresponding entry below.
 *    The path must start with '/' and be relative to public/.
 *    Example: glbPath: '/models/pommel_round.glb'
 *
 * 3. If glbPath is null, a coloured placeholder box is shown
 *    instead so you can still place and arrange the component.
 *
 * ─────────────────────────────────────────────────────────────
 * SCALING — modelUnit and defaultScale
 * ─────────────────────────────────────────────────────────────
 * The 3D scene uses METRES as its native unit. If your GLB was
 * modelled in a different unit, set `modelUnit` and the app will
 * apply the conversion automatically when you drop the part:
 *
 *   modelUnit: 'm'   → no change (default)
 *   modelUnit: 'cm'  → scale × 0.01
 *   modelUnit: 'mm'  → scale × 0.001
 *   modelUnit: 'in'  → scale × 0.0254  ← most CAD/3D-print tools
 *   modelUnit: 'ft'  → scale × 0.3048
 *
 * For a fully custom initial scale, set `defaultScale: [x, y, z]`
 * instead (this overrides modelUnit).
 *
 * You can always fine-tune the scale in the Properties panel after
 * placing a component.
 * ─────────────────────────────────────────────────────────────
 * INITIAL ROTATION — defaultRotation
 * ─────────────────────────────────────────────────────────────
 * Set `defaultRotation: [x, y, z]` (in DEGREES) to give a component
 * a non-zero orientation the moment it is placed.  Omit the field
 * (or set it to null) to keep the default [0, 0, 0].
 *
 * Example — rotate a washer flat onto the XZ plane on placement:
 *   defaultRotation: [90, 0, 0]
 * ─────────────────────────────────────────────────────────────
 * COMPONENT HEIGHT — height
 * ─────────────────────────────────────────────────────────────
 * Set `height` to the physical height (length along the assembly
 * axis) of the part in INCHES.  This value is stored as metadata
 * on the scene component and is not shown in the UI — it is
 * reserved for future use (e.g. auto-stacking, clearance checks).
 *
 * Omit or set to null if the height is unknown or not yet needed.
 *
 * Example:
 *   height: 10   // a 10-inch carriage bolt
 *   height: 0.1  // a thin 0.1-inch washer
 * ─────────────────────────────────────────────────────────────
 * PIVOT OFFSET — pivotY
 * ─────────────────────────────────────────────────────────────
 * Distance (in the same units as `height`) from the model's
 * bottom face to its pivot/origin point.
 *
 *   pivotY: height/2  → pivot at centre  (default, no need to set)
 *   pivotY: 0         → pivot at bottom face
 *   pivotY: height    → pivot at top face
 *
 * Use this when same-type parts stack flush but mixing part types
 * leaves a gap or causes clipping — it means the models have
 * different pivot positions.
 * ─────────────────────────────────────────────────────────────
 * BASE COMPONENT — isBase
 * ─────────────────────────────────────────────────────────────
 * Set `isBase: true` on any component that acts as a structural
 * foundation (e.g. a carriage bolt).  Base components:
 *   • Are placed on the floor (Y = 0) like any other component.
 *   • Are EXCLUDED from the stack-top calculation so that washers
 *     and other parts stack from the floor upward along the bolt
 *     shaft, not from the tip of the bolt.
 * ─────────────────────────────────────────────────────────────
 */

export const COMPONENT_CATEGORIES = [
  {
    id: 'base_bolt',
    label: 'Base Bolt - Saber Length',
    components: [
      {
        type: 'base_10in',
        name: '10 inch Base Bolt',
        description: 'Classic round base bolt',
        glbPath: '/models/10_in_car_blt.glb',
        color: '#969696',
        mcmasterPart: '90185A275',
        price: 1.00,
        placeholderSize: [0.6, 0.6, 0.6],
        modelUnit: 'in',
        defaultRotation: [180, 0, 0],
        isBase: true,   // excluded from stack-top calculation
      },
      {
        type: 'base_9in',
        name: '9 inch Base Bolt',
        description: 'Classic round base bolt',
        glbPath: '/models/9_in_car_blt.glb',
        color: '#969696',
        mcmasterPart: '90185A272',
        price: 1.00,
        placeholderSize: [0.6, 0.6, 0.6],
        modelUnit: 'in',
        defaultRotation: [180, 0, 0],
        isBase: true,
      },
      {
        type: 'base_8in',
        name: '8 inch Base Bolt',
        description: 'Classic round base bolt',
        glbPath: '/models/8_in_car_blt.glb',
        color: '#969696',
        mcmasterPart: '90185A272',
        price: 1.00,
        placeholderSize: [0.6, 0.6, 0.6],
        modelUnit: 'in',
        defaultRotation: [180, 0, 0],
        isBase: true,
      },
    ],
  },
  {
    id: 'grip',
    label: 'Grip',
    components: [
      {
        type: 'grip_straight',
        name: 'Straight Grip',
        description: 'Simple straight grip',
        glbPath: null,                    // ← Replace with '/models/grip_straight.glb'
        color: '#8B4513',
        price: 1.00,
        placeholderSize: [0.25, 1.2, 0.25],
        modelUnit: 'in',
      },
      {
        type: 'grip_tapered',
        name: 'Tapered Grip',
        description: 'Tapers toward the pommel end',
        glbPath: null,                    // ← Replace with '/models/grip_tapered.glb'
        color: '#A0522D',
        price: 1.00,
        placeholderSize: [0.25, 1.0, 0.25],
        modelUnit: 'in',
      },
      {
        type: 'grip_waisted',
        name: 'Waisted Grip',
        description: 'Narrowed in the middle for control',
        glbPath: null,                    // ← Replace with '/models/grip_waisted.glb'
        color: '#D2691E',
        price: 1.00,
        placeholderSize: [0.28, 1.1, 0.28],
        modelUnit: 'in',
      },
    ],
  },
  {
    id: 'guard',
    label: 'Washers - Guard / Crossguard',
    components: [
      {
        type: 'guard_straight',
        name: 'Straight Crossguard',
        description: 'Classic straight quillons',
        glbPath: '/models/washer.glb',    // ← Replace with '/models/guard_straight.glb'
        color: '#696969',
        price: 1.00,
        placeholderSize: [2.0, 0.2, 0.3],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
      },
      {
        type: 'guard_curved',
        name: '2 Inch Washer Silver',
        description: 'Quillons curve toward blade',
        glbPath: '/models/2_in_wshr.glb',
        color: '#808080',
        price: 0.20,
        placeholderSize: [2.0, 0.25, 0.3],
        modelUnit: 'in',
        defaultRotation: [0, 90, 0],
        height: 0.045,
      },
      {
        type: 'guard_curved',
        name: '2 Inch Washer Black',
        description: 'Quillons curve toward blade',
        glbPath: '/models/2_in_wshr.glb',
        color: '#212121',
        price: 0.20,
        placeholderSize: [2.0, 0.25, 0.3],
        modelUnit: 'in',
        defaultRotation: [0, 90, 0],
        height: 0.045,
      },
      {
        type: 'guard_disk',
        name: '5/16 Inch Washer Silver Siler',
        description: 'Round disk-style guard',
        glbPath: '/models/5-16_1_in_wshr.glb',
        color: '#9E9E9E',
        price: 0.15,
        placeholderSize: [1.2, 0.15, 1.2],
        modelUnit: 'in',
        defaultRotation: [0, 0, 90],
        height: 0.04,
        pivotY: 0,
      },
      {
        type: 'guard_disk',
        name: '5/16 Inch Washer Silver Black',
        description: 'Round disk-style guard',
        glbPath: '/models/5-16_1_in_wshr.glb',
        color: '#212121',
        price: 0.15,
        placeholderSize: [1.2, 0.15, 1.2],
        modelUnit: 'in',
        defaultRotation: [0, 0, 90],
        height: 0.04,
        pivotY: 0,
      },
    ],
  },
  {
    id: 'collar',
    label: 'Collar / Ricasso Block',
    components: [
      {
        type: 'collar_round',
        name: 'Round Collar',
        description: 'Cylindrical collar/spacer',
        glbPath: '/models/PipeTest.glb',
        color: '#B8860B',
        price: 3.45,
        placeholderSize: [0.35, 0.25, 0.35],
        modelUnit: 'in',
        height: 3.25,
      },
      {
        type: 'collar_split',
        name: 'Split Collar',
        description: 'Side Split Collar',
        glbPath: '/models/Splitter.glb',
        color: '#909090',
        price: 1.00,
        placeholderSize: [0.35, 0.3, 0.35],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 1.2,
      },
      {
        type: 'pipe_4in',
        name: '4 Inch Pipe',
        description: 'Standard 4 inch pipe',
        glbPath: '/models/4_in_pipe.glb',
        color: '#909090',
        price: 1.00,
        placeholderSize: [0.35, 0.3, 0.35],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 1.2,
      },
      {
        type: 'pipe_5in',
        name: '5 Inch Pipe',
        description: 'Standard 5 inch pipe',
        glbPath: '/models/5_in_pipe.glb',
        color: '#909090',
        price: 1.00,
        placeholderSize: [0.35, 0.3, 0.35],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 1.2,
      },
      {
        type: 'pipe_6in',
        name: '6 Inch Pipe',
        description: 'Standard 6 inch pipe',
        glbPath: '/models/6_in_pipe.glb',
        color: '#909090',
        price: 1.00,
        placeholderSize: [0.35, 0.3, 0.35],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 1.2,
      },
    ],
  },
  {
    id: 'misc',
    label: 'Misc / Custom',
    components: [
      {
        type: 'spacer',
        name: 'Pressure Adaptor',
        description: 'Thin spacer between parts',
        glbPath: '/models/Prs-adaptor.glb',
        color: '#9f9f9f',
        price: 0.50,
        placeholderSize: [0.3, 0.1, 0.3],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 0.37,
      },
      {
        type: 'custom_1',
        name: 'Spring',
        description: 'Your custom component',
        glbPath: '/models/Spring.glb',
        color: '#acacac',
        price: 1.00,
        placeholderSize: [0.5, 0.5, 0.5],
        modelUnit: 'in',
        defaultRotation: [90, 0, 0],
        height: 1.0,
      },
      {
        type: 'nut',
        name: 'Nut 1',
        description: 'Your custom component',
        glbPath: '/models/Nut.glb',
        color: '#727272',
        price: 0.10,
        placeholderSize: [0.5, 0.5, 0.5],
        modelUnit: 'in',
        height: 0.42,
      },
    ],
  },
];

// Flat list of all components, convenient for lookups
export const ALL_COMPONENTS = COMPONENT_CATEGORIES.flatMap((cat) => cat.components);

// Find a component definition by type string
export function findComponentDef(type) {
  return ALL_COMPONENTS.find((c) => c.type === type) ?? null;
}
