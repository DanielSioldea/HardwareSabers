import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getUnitScale } from '../utils/unitScale';

const useStore = create((set, get) => ({
  // ─── Scene Components ───────────────────────────────────────────────────────
  sceneComponents: [],

  // Running Y accumulator for height-aware stacking.
  // Each component with a `height` value advances this cursor by that amount,
  // and is placed with its centre at cursor + height/2 so the bottom face
  // lands exactly on the current stack top.
  stackHeight: 0,

  addComponent: (componentDef, position = [0, 0, 0]) => {
    const { stackHeight } = get();
    const hasHeight = componentDef.height != null;

    // pivotY = distance from the model's bottom face to its pivot point.
    // Default: height/2 (centre pivot). Set pivotY: 0 in the config for bottom-pivot models.
    const pivotY = hasHeight
      ? (componentDef.pivotY ?? componentDef.height / 2)
      : 0;
    const yPos = hasHeight ? stackHeight + pivotY : position[1];

    const newComponent = {
      id: uuidv4(),
      type: componentDef.type,
      name: componentDef.name,
      glbPath: componentDef.glbPath,
      color: componentDef.color || '#cccccc',
      placeholderSize: componentDef.placeholderSize || [0.5, 0.5, 0.5],
      position: [position[0], yPos, position[2]],
      rotation: componentDef.defaultRotation
        ? componentDef.defaultRotation.map((d) => d * (Math.PI / 180))
        : [0, 0, 0],
      scale: componentDef.defaultScale
        ? [...componentDef.defaultScale]
        : (() => { const s = getUnitScale(componentDef.modelUnit); return [s, s, s]; })(),
      price: componentDef.price ?? 1.00,
      height: componentDef.height ?? null,
      isBase: componentDef.isBase ?? false,
    };

    set((state) => ({
      sceneComponents: [...state.sceneComponents, newComponent],
      stackHeight: hasHeight
        ? state.stackHeight + componentDef.height
        : state.stackHeight,
    }));

    return newComponent.id;
  },

  updateComponentTransform: (id, position, rotation, scale) => {
    set((state) => ({
      sceneComponents: state.sceneComponents.map((c) =>
        c.id === id ? { ...c, position, rotation, scale } : c
      ),
    }));
  },

  removeComponent: (id) => {
    set((state) => {
      const comp = state.sceneComponents.find((c) => c.id === id);
      const delta = comp?.height ?? 0;
      return {
        sceneComponents: state.sceneComponents.filter((c) => c.id !== id),
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
        stackHeight: Math.max(0, state.stackHeight - delta),
      };
    });
  },

  duplicateComponent: (id) => {
    const comp = get().sceneComponents.find((c) => c.id === id);
    if (!comp) return;
    const newComp = {
      ...comp,
      id: uuidv4(),
      name: `${comp.name} (copy)`,
      position: [comp.position[0] + 0.02, comp.position[1], comp.position[2] + 0.02],
    };
    set((state) => ({ sceneComponents: [...state.sceneComponents, newComp] }));
  },

  // ─── Selection ──────────────────────────────────────────────────────────────
  selectedComponentId: null,
  selectComponent: (id) => set({ selectedComponentId: id }),
  deselectAll: () => set({ selectedComponentId: null }),

  // ─── Transform Mode ─────────────────────────────────────────────────────────
  transformMode: 'translate',
  setTransformMode: (mode) => set({ transformMode: mode }),

  // ─── Surface Mating ─────────────────────────────────────────────────────────
  mateMode: false,
  mateState: { surfaceA: null, surfaceB: null },

  toggleMateMode: () =>
    set((state) => ({
      mateMode: !state.mateMode,
      mateState: { surfaceA: null, surfaceB: null },
      selectedComponentId: null,
    })),

  setMateSurface: (surface) => {
    set((state) => {
      const { surfaceA, surfaceB } = state.mateState;
      if (!surfaceA) return { mateState: { surfaceA: surface, surfaceB: null } };
      if (!surfaceB && surface.componentId !== surfaceA.componentId)
        return { mateState: { surfaceA, surfaceB: surface } };
      return { mateState: { surfaceA: surface, surfaceB: null } };
    });
  },

  clearMateState: () => set({ mateState: { surfaceA: null, surfaceB: null } }),
}));

export default useStore;
