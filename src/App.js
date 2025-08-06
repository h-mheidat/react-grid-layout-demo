import React, { useState } from 'react';
import './App.css';
import EditorPage from './EditorPage';
import ConfigurableEditorPage from './ConfigurableEditorPage';

function App() {
  const [useConfigurableEditor, setUseConfigurableEditor] = useState(false);

  return (
    <div className="App">
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 1000, 
        background: 'white', 
        padding: '10px', 
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <label>
          <input
            type="checkbox"
            checked={useConfigurableEditor}
            onChange={(e) => setUseConfigurableEditor(e.target.checked)}
          />
          Use Configurable Grid Layout
        </label>
      </div>
      
      {useConfigurableEditor ? <ConfigurableEditorPage /> : <EditorPage />}
    </div>
  );
}

export default App;
