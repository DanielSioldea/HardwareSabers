import React, { useState } from 'react';
import { COMPONENT_CATEGORIES } from '../../config/componentLibrary';
import useStore from '../../store/useStore';

/**
 * Left-side panel listing all available hilt components.
 * Clicking a card adds the component to the scene at position (0, 0, 0).
 */
export default function ComponentLibrary() {
  const [openCategories, setOpenCategories] = useState(
    () => Object.fromEntries(COMPONENT_CATEGORIES.map((c) => [c.id, true]))
  );

  const { addComponent } = useStore();

  function toggleCategory(id) {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <aside className="component-library">
      <div className="panel-header">
        <h2>Components</h2>
        <span className="panel-subtitle">Click to add</span>
      </div>

      <div className="library-body">
        {COMPONENT_CATEGORIES.map((category) => (
          <div key={category.id} className="library-category">
            {/* Category accordion header */}
            <button
              className="category-header"
              onClick={() => toggleCategory(category.id)}
            >
              <span className="category-arrow">{openCategories[category.id] ? '▾' : '▸'}</span>
              <span>{category.label}</span>
              <span className="category-count">{category.components.length}</span>
            </button>

            {/* Component cards */}
            {openCategories[category.id] && (
              <div className="category-items">
                {category.components.map((comp) => (
                  <div
                    key={comp.type}
                    className="component-card"
                    role="button"
                    tabIndex={0}
                    title={comp.description}
                    onClick={() => addComponent(comp, [0, 0, 0])}
                    onKeyDown={(e) => e.key === 'Enter' && addComponent(comp, [0, 0, 0])}
                  >
                    {/* Colour swatch preview */}
                    <div
                      className="component-swatch"
                      style={{ backgroundColor: comp.color }}
                    >
                      <span className="swatch-icon">▣</span>
                    </div>

                    <div className="component-info">
                      <span className="component-name">{comp.name}</span>
                      {/* {comp.glbPath ? (
                        <span className="component-badge glb">GLB</span>
                      ) : (
                        <span className="component-badge placeholder">Box</span>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      {/* <div className="library-footer">
        <p>Add your .glb files to <code>public/models/</code></p>
        <p>then set <code>glbPath</code> in</p>
        <p><code>src/config/componentLibrary.js</code></p>
      </div> */}
    </aside>
  );
}
