import React, { useState, useEffect, useRef } from 'react';
import useStore from '../../store/useStore';

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

// ─── Shared number input ─────────────────────────────────────────────────────

/**
 * Buffers user typing in local state so partially-typed values are never
 * overwritten by a store update mid-keystroke.
 * Commits on blur or Enter; resets on Escape.
 */
function NumberInput({ displayValue, step, onCommit }) {
  const [raw, setRaw] = useState(displayValue);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setRaw(displayValue);
  }, [displayValue]);

  function commit(str) {
    const n = parseFloat(str);
    if (!isNaN(n)) onCommit(n);
    else setRaw(displayValue);
  }

  return (
    <input
      type="number"
      step={step}
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onFocus={(e) => { focused.current = true; e.target.select(); }}
      onBlur={() => { focused.current = false; commit(raw); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); commit(raw); e.target.blur(); }
        if (e.key === 'Escape') { setRaw(displayValue); focused.current = false; e.target.blur(); }
      }}
    />
  );
}

// ─── Build list ──────────────────────────────────────────────────────────────

/**
 * Shown when nothing is selected. Lists every component currently in the scene.
 * Clicking a row selects that component and opens the Properties view.
 */
function BuildList({ components, selectedId, onSelect, onDelete }) {
  if (components.length === 0) {
    return (
      <div className="build-list-empty">
        <p>No components in the build yet.</p>
        <p>Click a part in the left panel to add one.</p>
      </div>
    );
  }

  return (
    <div className="build-list">
      {components.map((comp) => (
        <div
          key={comp.id}
          className={`build-list-item ${selectedId === comp.id ? 'selected' : ''}`}
          onClick={() => onSelect(comp.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(comp.id)}
          title="Click to edit properties"
        >
          {/* Colour swatch */}
          <span
            className="build-item-swatch"
            style={{ backgroundColor: comp.color }}
          />

          {/* Name */}
          <span className="build-item-name">{comp.name}</span>

          {/* Delete button — stops propagation so it doesn't also select */}
          <button
            className="build-item-delete"
            title="Remove from build"
            onClick={(e) => { e.stopPropagation(); onDelete(comp.id); }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Properties view ─────────────────────────────────────────────────────────

/**
 * Shows transform controls for the selected component.
 * The X button in the header dismisses this view and returns to the build list.
 */
function PropertiesView({ selected, onClose, updateComponentTransform, removeComponent, duplicateComponent }) {
  function setAxis(field, axis, displayValue) {
    const current = [...selected[field]];
    current[axis] = field === 'rotation' ? displayValue * RAD : displayValue;
    updateComponentTransform(
      selected.id,
      field === 'position' ? current : selected.position,
      field === 'rotation' ? current : selected.rotation,
      field === 'scale'    ? current : selected.scale,
    );
  }

  function flipAxis(axis) {
    const rotation = [...selected.rotation];
    rotation[axis] = Math.atan2(
      Math.sin(rotation[axis] + Math.PI),
      Math.cos(rotation[axis] + Math.PI)
    );
    updateComponentTransform(selected.id, selected.position, rotation, selected.scale);
  }

  function centerComponent(axes) {
    const newPos = [...selected.position];
    if (axes === 'xz' || axes === 'xyz') { newPos[0] = 0; newPos[2] = 0; }
    if (axes === 'xyz') { newPos[1] = 0; }
    updateComponentTransform(selected.id, newPos, selected.rotation, selected.scale);
  }

  function resetTransform() {
    updateComponentTransform(selected.id, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
  }

  const pos = selected.position;
  const rot = selected.rotation.map((r) => r * DEG);
  const scl = selected.scale;

  return (
    <>
      {/* Header with component name and close button */}
      <div className="panel-header properties-header">
        <div className="properties-title">
          <span
            className="properties-swatch"
            style={{ backgroundColor: selected.color }}
          />
          <h2 title={selected.name}>{selected.name}</h2>
        </div>
        <button
          className="panel-close-btn"
          onClick={onClose}
          title="Close properties (back to build list)"
        >
          ✕
        </button>
      </div>

      <div className="properties-scroll">
        {/* ── Position ── */}
        <section className="transform-section">
          <h3>Position</h3>
          {['X', 'Y', 'Z'].map((axis, i) => (
            <label key={axis} className="transform-row">
              <span className={`axis-label axis-${axis.toLowerCase()}`}>{axis}</span>
              <NumberInput
                displayValue={pos[i].toFixed(3)}
                step="0.05"
                onCommit={(v) => setAxis('position', i, v)}
              />
            </label>
          ))}
        </section>

        {/* ── Align to origin ── */}
        <section className="transform-section">
          <h3>Align to Origin</h3>
          <div className="flip-row">
            <button className="btn-flip" onClick={() => centerComponent('xz')} title="Set X=0, Z=0 (keep height)">
              Centre X/Z
            </button>
            <button className="btn-flip" onClick={() => centerComponent('xyz')} title="Set X=0, Y=0, Z=0">
              Centre All
            </button>
          </div>
        </section>

        {/* ── Rotation ── */}
        <section className="transform-section">
          <h3>Rotation (°)</h3>
          {['X', 'Y', 'Z'].map((axis, i) => (
            <label key={axis} className="transform-row">
              <span className={`axis-label axis-${axis.toLowerCase()}`}>{axis}</span>
              <NumberInput
                displayValue={rot[i].toFixed(2)}
                step="5"
                onCommit={(v) => setAxis('rotation', i, v)}
              />
            </label>
          ))}
        </section>

        {/* ── Scale ── */}
        <section className="transform-section">
          <h3>Scale</h3>
          {['X', 'Y', 'Z'].map((axis, i) => (
            <label key={axis} className="transform-row">
              <span className={`axis-label axis-${axis.toLowerCase()}`}>{axis}</span>
              <NumberInput
                displayValue={scl[i].toFixed(3)}
                step="0.1"
                onCommit={(v) => setAxis('scale', i, v)}
              />
            </label>
          ))}
        </section>

        {/* ── Flip axes ── */}
        <section className="transform-section">
          <h3>Flip (Rotate 180°)</h3>
          <div className="flip-row">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <button key={axis} className="btn-flip" onClick={() => flipAxis(i)}>
                Flip {axis}
              </button>
            ))}
          </div>
        </section>

        {/* ── Actions ── */}
        <section className="transform-section">
          <h3>Actions</h3>
          <div className="action-row">
            <button className="btn-secondary" onClick={resetTransform}>Reset Transform</button>
            <button className="btn-secondary" onClick={() => duplicateComponent(selected.id)}>Duplicate</button>
            <button className="btn-danger" onClick={() => { removeComponent(selected.id); onClose(); }}>Delete</button>
          </div>
        </section>
      </div>
    </>
  );
}

// ─── Root panel ──────────────────────────────────────────────────────────────

/**
 * Right-side panel.
 *
 * Modes:
 *  • Mate mode   → surface-mate instructions
 *  • No selection → Build List (all scene components; click one to edit)
 *  • Selection   → Properties view (transform controls + X to dismiss)
 */
export default function TransformPanel() {
  const {
    sceneComponents,
    selectedComponentId,
    selectComponent,
    deselectAll,
    updateComponentTransform,
    removeComponent,
    duplicateComponent,
    mateMode,
    mateState,
    clearMateState,
    toggleMateMode,
  } = useStore();

  const selected = sceneComponents.find((c) => c.id === selectedComponentId) ?? null;

  // ── Mate mode ────────────────────────────────────────────────────────────────
  if (mateMode) {
    return (
      <aside className="transform-panel mate-panel">
        <div className="panel-header">
          <h2>Surface Mate</h2>
        </div>
        <div className="mate-instructions">
          <p>
            Click a face on <strong>Component A</strong> (highlights blue), then a face on{' '}
            <strong>Component B</strong> (orange). Press <em>Apply Mate</em> to align them.
          </p>
          <div className="mate-surface-info">
            <div className={`surface-badge ${mateState.surfaceA ? 'set' : ''}`}>
              A: {mateState.surfaceA ? `…${mateState.surfaceA.componentId.slice(-4)}` : 'Not picked'}
            </div>
            <div className={`surface-badge ${mateState.surfaceB ? 'set' : ''}`}>
              B: {mateState.surfaceB ? `…${mateState.surfaceB.componentId.slice(-4)}` : 'Not picked'}
            </div>
          </div>
          <button
            className="btn-primary"
            disabled={!(mateState.surfaceA && mateState.surfaceB)}
            onClick={() => window.dispatchEvent(new CustomEvent('applyMate'))}
          >
            Apply Mate
          </button>
          <button className="btn-secondary" onClick={clearMateState}>Clear</button>
          <button className="btn-secondary" onClick={toggleMateMode}>Exit Mate Mode</button>
        </div>
      </aside>
    );
  }

  // ── Properties view (component selected) ────────────────────────────────────
  if (selected) {
    return (
      <aside className="transform-panel">
        <PropertiesView
          selected={selected}
          onClose={deselectAll}
          updateComponentTransform={updateComponentTransform}
          removeComponent={removeComponent}
          duplicateComponent={duplicateComponent}
        />
      </aside>
    );
  }

  // ── Build list (nothing selected) ───────────────────────────────────────────
  return (
    <aside className="transform-panel">
      <div className="panel-header">
        <h2>Build List</h2>
        <span className="panel-subtitle">
          {sceneComponents.length === 0
            ? 'Empty'
            : `${sceneComponents.length} part${sceneComponents.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <BuildList
        components={sceneComponents}
        selectedId={selectedComponentId}
        onSelect={selectComponent}
        onDelete={removeComponent}
      />
    </aside>
  );
}
