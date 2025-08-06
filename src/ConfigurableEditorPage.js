import React, { useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './ConfigurableEditorPage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ConfigurableEditorPage = () => {
  const [layouts, setLayouts] = useState({});
  const [sections, setSections] = useState([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const gridRef = useRef(null);

  // Breakpoints for responsive design - increased columns for more flexibility
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }; // Doubled the columns for finer control

  // Add a new configurable section
  const addSection = () => {
    if (!newSectionName.trim()) return;
    
    const newSection = {
      i: `section-${Date.now()}`,
      name: newSectionName,
      content: '',
      x: 0,
      y: 0,
      w: 6, // Default width (6 out of 24 columns = 1/4 of the page width)
      h: 8, // Default height
      minW: 1, // Much smaller minimum width - allows for many more columns
      minH: 2, // Reasonable minimum height
    };

    setSections(prev => [...prev, newSection]);
    setNewSectionName('');
    setIsConfigModalOpen(false);
  };

  // Remove a section
  const removeSection = (sectionId) => {
    setSections(prev => prev.filter(section => section.i !== sectionId));
  };

  // Update section content
  const updateSectionContent = (sectionId, content) => {
    setSections(prev => 
      prev.map(section => 
        section.i === sectionId 
          ? { ...section, content } 
          : section
      )
    );
  };

  // Apply formatting to active section
  const applyFormatting = (command, value = null) => {
    if (activeSection) {
      document.execCommand(command, false, value);
    }
  };

  // Handle layout changes
  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
    
    // Update section positions
    setSections(prev => 
      prev.map(section => {
        const layoutItem = layout.find(item => item.i === section.i);
        return layoutItem 
          ? { ...section, ...layoutItem }
          : section;
      })
    );
  };

  // Generate layout for React Grid Layout (utility function for future use)
  // const generateLayout = () => {
  //   return sections.map(section => ({
  //     i: section.i,
  //     x: section.x,
  //     y: section.y,
  //     w: section.w,
  //     h: section.h,
  //     minW: section.minW,
  //     minH: section.minH,
  //   }));
  // };

  return (
    <div className="editor-page">
      <div className="controls">
        <button onClick={() => setIsConfigModalOpen(true)}>
          Add Custom Section
        </button>

        <button onClick={() => setSections([])}>
          Clear All Sections
        </button>
      </div>

      {/* Shared Rich Text Toolbar */}
      {sections.length > 0 && (
        <div className="shared-toolbar">
          <div className="toolbar-section">
            <button onClick={() => applyFormatting('bold')} title="Bold">
              <strong>B</strong>
            </button>
            <button onClick={() => applyFormatting('italic')} title="Italic">
              <em>I</em>
            </button>
            <button onClick={() => applyFormatting('underline')} title="Underline">
              <u>U</u>
            </button>
          </div>
          <div className="toolbar-section">
            <button onClick={() => applyFormatting('insertOrderedList')} title="Numbered List">
              1.
            </button>
            <button onClick={() => applyFormatting('insertUnorderedList')} title="Bullet List">
              •
            </button>
          </div>
          <div className="toolbar-section">
            <button onClick={() => applyFormatting('formatBlock', 'h1')} title="Header 1">
              H1
            </button>
            <button onClick={() => applyFormatting('formatBlock', 'h2')} title="Header 2">
              H2
            </button>
            <button onClick={() => applyFormatting('formatBlock', 'h3')} title="Header 3">
              H3
            </button>
          </div>
          <div className="toolbar-section">
            <button onClick={() => applyFormatting('justifyLeft')} title="Align Left">
              ←
            </button>
            <button onClick={() => applyFormatting('justifyCenter')} title="Align Center">
              ↔
            </button>
            <button onClick={() => applyFormatting('justifyRight')} title="Align Right">
              →
            </button>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {isConfigModalOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Add New Section</h2>
            <input
              type="text"
              placeholder="Section name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSection()}
            />
            <div className="dialog-buttons">
              <button onClick={addSection}>Add Section</button>
              <button onClick={() => setIsConfigModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="a4-page-container">
        <div className="a4-page">
          <ResponsiveGridLayout
            ref={gridRef}
            className="layout"
            layouts={layouts}
            onLayoutChange={onLayoutChange}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={20}
            width={1200}
            isDraggable={true}
            isResizable={true}
            margin={[5, 5]}
            containerPadding={[5, 5]}
          >
            {sections.map((section) => (
              <div
                key={section.i}
                className="grid-item"
                data-grid={{
                  x: section.x,
                  y: section.y,
                  w: section.w,
                  h: section.h,
                  minW: section.minW,
                  minH: section.minH,
                }}
              >
                <button
                  className="remove-section"
                  onClick={() => removeSection(section.i)}
                >
                  ×
                </button>
                <div 
                  className="section-content"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onFocus={() => setActiveSection(section.i)}
                  onBlur={(e) => updateSectionContent(section.i, e.target.innerHTML)}
                  onInput={(e) => updateSectionContent(section.i, e.target.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: section.content || '' }}
                  data-placeholder={`Enter content for ${section.name}...`}
                  style={{ 
                    minHeight: '100%',
                    padding: '15px',
                    outline: 'none',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
};

export default ConfigurableEditorPage;
