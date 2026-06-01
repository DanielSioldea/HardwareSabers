import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

// Icon SVGs kept inline to avoid an icon-library dependency
const Icons = {
  Translate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 3v18M3 12h18"/>
    </svg>
  ),
  Rotate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  Scale: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
    </svg>
  ),
  Mate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
      <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  Delete: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Duplicate: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
};

export default function Toolbar() {
  const navigate = useNavigate();
  const {
    transformMode, setTransformMode,
    mateMode, toggleMateMode,
    selectedComponentId,
    removeComponent, duplicateComponent,
    mateState,
  } = useStore();

  const hasSelection = !!selectedComponentId;
  const bothSurfacesSelected = !!(mateState.surfaceA && mateState.surfaceB);

  return (
    <header className="toolbar">

      {/* Page navigation */}
      <nav className="toolbar-nav">
        <button className="toolbar-nav-btn" onClick={() => navigate('/')}>
          Home
        </button>
        <button className="toolbar-nav-btn active" onClick={() => navigate('/builder')}>
          Builder
        </button>
        <button className="toolbar-nav-btn" onClick={() => navigate('/checkout')}>
          Summary
        </button>
      </nav>

      <div className="toolbar-title">
        <img src="/saber-ico.svg" alt="" className="toolbar-title-icon" />
        <span>Hardware Saber Builder</span>
      </div>

      

      {/* Transform mode group — only shown when not in mate mode */}
      {/* {!mateMode && (
        <div className="toolbar-group">
          <span className="toolbar-group-label">Transform</span>
          {(['translate', 'rotate', 'scale']).map((mode) => (
            <button
              key={mode}
              className={`toolbar-btn ${transformMode === mode ? 'active' : ''}`}
              onClick={() => setTransformMode(mode)}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} (${mode === 'translate' ? 'W' : mode === 'rotate' ? 'E' : 'R'})`}
            >
              {mode === 'translate' && <Icons.Translate />}
              {mode === 'rotate' && <Icons.Rotate />}
              {mode === 'scale' && <Icons.Scale />}
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </button>
          ))}
        </div>
      )} */}

      {/* Component actions — only shown when something is selected */}
      {/* {!mateMode && hasSelection && (
        <div className="toolbar-group">
          <span className="toolbar-group-label">Selection</span>
          <button
            className="toolbar-btn"
            onClick={() => duplicateComponent(selectedComponentId)}
            title="Duplicate selected component"
          >
            <Icons.Duplicate /><span>Duplicate</span>
          </button>
          <button
            className="toolbar-btn danger"
            onClick={() => removeComponent(selectedComponentId)}
            title="Delete selected component"
          >
            <Icons.Delete /><span>Delete</span>
          </button>
        </div>
      )} */}

      {/* Surface mate controls */}
      {/* <div className="toolbar-group">
        <span className="toolbar-group-label">Mating</span>
        <button
          className={`toolbar-btn ${mateMode ? 'active warning' : ''}`}
          onClick={toggleMateMode}
          title="Toggle surface-mate mode: pick two faces to align them"
        >
          <Icons.Mate />
          <span>{mateMode ? 'Exit Mate Mode' : 'Mate Surfaces'}</span>
        </button> */}

        {/* Mate mode status indicator */}
        {/* {mateMode && (
          <div className="mate-status">
            <div className={`mate-step ${mateState.surfaceA ? 'done' : 'active'}`}>
              {mateState.surfaceA ? '✓' : '1'} Surface A
            </div>
            <div className={`mate-step ${mateState.surfaceB ? 'done' : mateState.surfaceA ? 'active' : ''}`}>
              {mateState.surfaceB ? '✓' : '2'} Surface B
            </div>
          </div>
        )}
      </div> */}

      {/* Keyboard shortcut hints */}
      {/* <div className="toolbar-hints">
        <span>Orbit: LMB drag</span>
        <span>Pan: MMB drag</span>
        <span>Zoom: Scroll</span>
        <span>Select: Click</span>
      </div> */}
    </header>
  );
}
