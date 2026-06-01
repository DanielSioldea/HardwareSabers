import React, { useEffect } from 'react';
import Toolbar from '../components/UI/Toolbar';
import ComponentLibrary from '../components/UI/ComponentLibrary';
import TransformPanel from '../components/UI/TransformPanel';
import BuildCanvas from '../components/Canvas3D/BuildCanvas';
import useStore from '../store/useStore';

/**
 * The full 3D builder layout.
 * Moved here from App.jsx so App.jsx can own routing.
 *
 *  ┌──────────────────────────────────────────────────────┐
 *  │                      Toolbar                         │
 *  ├────────────┬─────────────────────────┬───────────────┤
 *  │ Component  │                         │   Transform   │
 *  │  Library   │     3D Build Canvas     │     Panel     │
 *  └────────────┴─────────────────────────┴───────────────┘
 */
export default function BuilderPage() {
  const { setTransformMode, selectedComponentId, removeComponent, deselectAll } = useStore();

  // Keyboard shortcuts: W=translate, E=rotate, R=scale, Delete=remove, Escape=deselect
  useEffect(() => {
    function onKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'w' || e.key === 'W') setTransformMode('translate');
      if (e.key === 'e' || e.key === 'E') setTransformMode('rotate');
      if (e.key === 'r' || e.key === 'R') setTransformMode('scale');
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId)
        removeComponent(selectedComponentId);
      if (e.key === 'Escape') deselectAll();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTransformMode, selectedComponentId, removeComponent, deselectAll]);

  return (
    <div className="app-layout">
      <Toolbar />
      <div className="app-body">
        <ComponentLibrary />
        <BuildCanvas />
        <TransformPanel />
      </div>
    </div>
  );
}
