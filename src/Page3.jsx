import "./Page3.css";
import PanelLV1 from "./metaphor/components/PanelLV1";
import PanelLV2 from "./metaphor/components/PanelLV2";
import PanelLV3 from "./metaphor/components/PanelLV3";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Page3() {
  const [selections, setSelections] = useState({
    type: null,
    order: null,
    connection: null,
    lv2: null,
    lv3: null
  });
  
  const navigate = useNavigate();
  
  const handleGoToSimulation = () => {
    setTimeout(() => {
      navigate("/login"); // Navigate directly to case/1
    }, 500); // Optional delay to simulate processing
  };

  // Load selections from localStorage when component mounts
  useEffect(() => {
    console.log("Page3 mounted - checking localStorage");
    const savedSelections = localStorage.getItem('snsSelections');
    console.log("Raw savedSelections from localStorage:", savedSelections);
    
    if (savedSelections) {
      try {
        const parsedSelections = JSON.parse(savedSelections);
        console.log("Parsed selections:", parsedSelections);
        setSelections(parsedSelections);
      } catch (error) {
        console.error('Error parsing selections from localStorage:', error);
      }
    } else {
      console.log("No selections found in localStorage");
    }
  }, []);

  // Add another useEffect to monitor selections state changes
  useEffect(() => {
    console.log("Current selections state:", selections);
  }, [selections]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Social Media Prototyping Simulation</h1>
        <h2>Features selected by the system:</h2>
      </header>
      <div className="panels-container">
        <PanelLV1 selections={selections} />
        <PanelLV2 selections={selections.lv2} />
        <PanelLV3 selectedConnection={selections.connection} selections={selections.lv3} />
      </div>
      <button
          className="simulation-buttonx"
          onClick={() => handleGoToSimulation()}
        >
          Go to Simulation
        </button>
    </div>
  );
}

export default Page3;