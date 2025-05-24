import "./App.css";
import "./FinalPage.css";
import PanelLV1 from "./metaphor/components/PanelLV1";
import PanelLV2 from "./metaphor/components/PanelLV2";
import PanelLV3 from "./metaphor/components/PanelLV3";
import { useState, useEffect } from "react";

function FinalPage() {
  const [selections, setSelections] = useState({
    type: null,
    order: null,
    connection: null,
    lv2: null,
    lv3: null
  });
  const llmResponse = "This is a test response";

  // Load selections from localStorage when component mounts
  useEffect(() => {
    const savedSelections = localStorage.getItem('snsSelections');
    if (savedSelections) {
      try {
        setSelections(JSON.parse(savedSelections));
      } catch (error) {
        console.error('Error loading selections from localStorage:', error);
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SNS Simulation</h1>
        <div className="keyword-container">
            <h3>Selected Keyword:</h3>
        <div className="keyword-content">{selections.keyword}</div>
      </div>
      </header>
      <main>
        <div className="llm-response">
          <h3>Generated Response:</h3>
          <div className="response-content">{llmResponse}</div>
        </div>
        <div className="llm-response">
          <h3>Generated Response:</h3>
          <div className="response-content">{llmResponse}</div>
        </div>
        <div className="panels-container">
          <PanelLV1 selections={selections} />
          <PanelLV2 selections={selections.lv2} />
          <PanelLV3 selectedConnection={selections.connection} selections={selections.lv3} />
        </div>
      </main>
    </div>
  );
}

export default FinalPage;