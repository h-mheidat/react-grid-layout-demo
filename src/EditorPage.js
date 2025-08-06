import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditorPage.css';

const EditorPage = () => {
  const [editorContent, setEditorContent] = useState('');
  const [isSectionsDialogVisible, setIsSectionsDialogVisible] = useState(false);
  const [isGridDialogVisible, setIsGridDialogVisible] = useState(false);
  const [numSections, setNumSections] = useState(1);
  const [sectionsConfig, setSectionsConfig] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);

  const handleConfigureLayout = () => {
    setIsSectionsDialogVisible(true);
  };

  const handleSectionsSubmit = () => {
    setIsSectionsDialogVisible(false);
    setSectionsConfig(
      Array.from({ length: numSections }, () => ({ rows: 1, cols: 1 }))
    );
    setCurrentSection(0);
    setIsGridDialogVisible(true);
  };

  const handleGridSubmit = () => {
    if (currentSection < numSections - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsGridDialogVisible(false);
      generateContent();
    }
  };

  const handleSectionConfigChange = (index, field, value) => {
    const newConfig = [...sectionsConfig];
    newConfig[index][field] = parseInt(value, 10) || 1;
    setSectionsConfig(newConfig);
  };

  const generateContent = () => {
    const mainSections = sectionsConfig.map((config, index) => {
      const subSections = [];
      for (let i = 0; i < config.rows * config.cols; i++) {
        subSections.push(
          `<div class="editor-section" style="border: 1px solid #ddd; padding: 10px; min-height: 50px;"><p>Section ${
            index + 1
          }.${i + 1}</p></div>`
        );
      }
      return `<div class="main-section" style="border: 2px dashed #ccc; padding: 10px; margin-bottom: 10px;">
                <div style="display: grid; grid-template-rows: repeat(${
                  config.rows
                }, 1fr); grid-template-columns: repeat(${
        config.cols
      }, 1fr); gap: 5px;">
                  ${subSections.join('')}
                </div>
              </div>`;
    });
    setEditorContent(mainSections.join(''));
  };

  return (
    <div className="editor-page">
      <div className="controls">
        <button onClick={handleConfigureLayout}>Configure Layout</button>
      </div>

      {isSectionsDialogVisible && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>How many main sections?</h2>
            <input
              type="number"
              value={numSections}
              onChange={(e) => setNumSections(parseInt(e.target.value, 10))}
              min="1"
            />
            <button onClick={handleSectionsSubmit}>Next</button>
          </div>
        </div>
      )}

      {isGridDialogVisible && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>
              Configure Section {currentSection + 1}
            </h2>
            <label>
              Rows:
              <input
                type="number"
                value={sectionsConfig[currentSection].rows}
                onChange={(e) =>
                  handleSectionConfigChange(
                    currentSection,
                    'rows',
                    e.target.value
                  )
                }
                min="1"
              />
            </label>
            <label>
              Columns:
              <input
                type="number"
                value={sectionsConfig[currentSection].cols}
                onChange={(e) =>
                  handleSectionConfigChange(
                    currentSection,
                    'cols',
                    e.target.value
                  )
                }
                min="1"
              />
            </label>
            <button onClick={handleGridSubmit}>
              {currentSection < numSections - 1 ? 'Next Section' : 'Finish'}
            </button>
          </div>
        </div>
      )}

      <div className="a4-page-container">
        <div className="a4-page">
          <ReactQuill
            value={editorContent}
            onChange={setEditorContent}
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
