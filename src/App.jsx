import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NFPage from "./pages/NF-Main";
import NCPage from "./pages/NC-Main";
import CGPage from "./pages/CG-Main";
import UserPage from "./pages/UserPage";
import ChatPage from "./pages/ChatPageOrCF-Main";
import LogIn from "./pages/LogIn";
import MetaphorPrompt from "./metaphor/ver4";
import PanelLV1 from "./metaphor/components/PanelLV1";
import PanelLV2 from "./metaphor/components/PanelLV2";
import PanelLV3 from "./metaphor/components/PanelLV3";
import "./App.css";

function MainPage() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState({ type: null, order: null, connection: null });
  const [llmResponse, setLlmResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectionChange = (key, value) => {
    setSelections(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMetaphorSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Create a formatted description from the form data
      const description = `In a space that feels ${formData.atmosphere}, people come together ${formData.reasonForGathering}, often connecting ${formData.connectionStyle}. They usually ${formData.durationOfParticipation}, interact through ${formData.communicationStyle}, and present themselves using ${formData.identityType}. Most people are here to ${formData.interactionGoal}, and they have the option to ${formData.participationControl}.`;

      console.log("Sending to step 2:", { description, metaphorKeyword: formData.metaphorKeyword });

      // Step 2: Convert description to attributes
      const step2Response = await fetch("http://localhost:5001/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 2,
          input: {
            description,
            metaphorKeyword: formData.metaphorKeyword
          },
          sessionId: Date.now().toString()
        }),
      });

      if (!step2Response.ok) {
        const errorText = await step2Response.text();
        throw new Error(`Error in step 2: ${step2Response.statusText}. Details: ${errorText}`);
      }

      const step2Data = await step2Response.json();
      console.log("Step 2 response:", step2Data);
      
      // Step 3: Convert attributes to features
      const step3Response = await fetch("http://localhost:5001/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 3,
          input: step2Data.attributes,
          sessionId: Date.now().toString()
        }),
      });

      if (!step3Response.ok) {
        const errorText = await step3Response.text();
        throw new Error(`Error in step 3: ${step3Response.statusText}. Details: ${errorText}`);
      }

      const step3Data = await step3Response.json();
      console.log("Step 3 response:", step3Data);
      setLlmResponse(step3Data.features);
    } catch (error) {
      console.error("Failed to process metaphor:", error);
      setLlmResponse(`An error occurred while processing your metaphor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/login"); // Navigate directly to case/1
    }, 500); // Optional delay to simulate processing
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SNS Simulation</h1>
      </header>
      <main>
        <div className="metaphor-section">
          <MetaphorPrompt onSubmit={handleMetaphorSubmit} />
          {isLoading && <div className="loading-message">Processing your metaphor...</div>}
        </div>
        <div className="llm-response">
          <h3>Generated Response:</h3>
          <div className="response-content">{llmResponse}</div>
        </div>
        <div className="panels-container">
          <PanelLV1 onSelectionChange={handleSelectionChange} />
          <PanelLV2 />
          <PanelLV3 selectedConnection={selections.connection} />
        </div>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleGoToSimulation()}
        >
          Go to Simulation
        </button>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/case/1/*" element={<NFPage />} />
        <Route path="/case/2/*" element={<NCPage />} />
        <Route path="/case/4" element={<CGPage />} />
        <Route path="/user/:userId" element={<UserPage />} />
        <Route path="/dms/*" element={<ChatPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;