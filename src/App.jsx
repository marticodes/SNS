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
  const [selections, setSelections] = useState({ 
    type: null, 
    order: null, 
    connection: null,
    lv2: null,
    lv3: null
  });
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
      const step2Response = await fetch("http://localhost:3001/api/llm", {
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
      const step3Response = await fetch("http://localhost:3001/api/llm", {
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
      
      // Parse the LLM response and update selections
      parseLLMResponse(step3Data.features);
    } catch (error) {
      console.error("Failed to process metaphor:", error);
      setLlmResponse(`An error occurred while processing your metaphor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const parseLLMResponse = (response) => {
    // Helper function to extract value from different formats
    const extractValue = (text, key) => {
      // Try different patterns
      const patterns = [
        new RegExp(`${key}:\\s*\\[(.*?)\\]`), // [value]
        new RegExp(`${key}:\\s*(.*?)(?=\\n|$)`), // value
        new RegExp(`${key}\\s*:\\s*(.*?)(?=\\n|$)`), // key : value
        new RegExp(`-\\s*${key}\\s*:\\s*(.*?)(?=\\n|$)`) // - key: value
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
      return null;
    };

    // Helper function to split multiple values
    const splitValues = (value) => {
      if (!value) return [];
      return value.toLowerCase().split(/[\/,]/).map(v => v.trim());
    };

    // Parse LV1 selections
    const lv1Match = response.match(/Network Structure([\s\S]*?)(?=Interaction Mechanisms|$)/i);
    if (lv1Match) {
      const lv1Content = lv1Match[1];
      
      // Parse Timeline Types
      const type = extractValue(lv1Content, 'Timeline Types');
      if (type) handleSelectionChange('type', type.toLowerCase());

      // Parse Content Order
      const order = extractValue(lv1Content, 'Content Order');
      if (order) handleSelectionChange('order', order.toLowerCase());

      // Parse Connection Type
      const connection = extractValue(lv1Content, 'Connection Type');
      if (connection) handleSelectionChange('connection', connection.toLowerCase());
    }

    // Parse LV2 selections
    const lv2Match = response.match(/Interaction Mechanisms([\s\S]*?)(?=Advanced Features|$)/i);
    if (lv2Match) {
      const lv2Content = lv2Match[1];
      const lv2Selections = {};

      // Parse Content Types
      const contentTypes = extractValue(lv2Content, 'Content Types');
      if (contentTypes) lv2Selections.contentTypes = splitValues(contentTypes);

      // Parse Commenting
      const commenting = extractValue(lv2Content, 'Commenting');
      if (commenting) lv2Selections.commenting = commenting.toLowerCase();

      // Parse Sharing
      const sharing = extractValue(lv2Content, 'Sharing');
      if (sharing) lv2Selections.sharing = [sharing.toLowerCase()];

      // Parse Reactions
      const reactions = extractValue(lv2Content, 'Reactions');
      if (reactions) lv2Selections.reactions = reactions.toLowerCase();

      // Parse Account Types
      const accountTypes = extractValue(lv2Content, 'Account Types');
      if (accountTypes) lv2Selections.accountTypes = [accountTypes.toLowerCase()];

      // Parse Identity Options
      const identity = extractValue(lv2Content, 'Identity Options');
      if (identity) lv2Selections.identity = identity.toLowerCase();

      // Parse Messaging
      const messagingMatch = lv2Content.match(/Messaging:([\s\S]*?)(?=\n\n|$)/i);
      if (messagingMatch) {
        const messagingContent = messagingMatch[1];
        
        // Parse Types
        const types = extractValue(messagingContent, 'Types');
        if (types) lv2Selections.messagingTypes = [types.toLowerCase()];

        // Parse Content
        const content = extractValue(messagingContent, 'Content');
        if (content) lv2Selections.messagingContent = splitValues(content);

        // Parse Content Management
        const management = extractValue(messagingContent, 'Content Management');
        if (management) lv2Selections.contentManagement = splitValues(management);

        // Parse Audience
        const audience = extractValue(messagingContent, 'Audience');
        if (audience) lv2Selections.audience = [audience.toLowerCase()];
      }

      setSelections(prev => ({
        ...prev,
        lv2: lv2Selections
      }));
    }

    // Parse LV3 selections
    const lv3Match = response.match(/Advanced Features & Customization([\s\S]*?)(?=\n\n|$)/i);
    if (lv3Match) {
      const lv3Content = lv3Match[1];
      const lv3Selections = {};

      // Parse Ephemeral Content
      const ephemeralMatch = lv3Content.match(/Ephemeral Content:([\s\S]*?)(?=Content Discovery|$)/i);
      if (ephemeralMatch) {
        const ephemeralContent = ephemeralMatch[1];
        lv3Selections.ephemeralContent = {};

        // Parse Enabled
        const enabled = extractValue(ephemeralContent, 'Enabled');
        if (enabled) lv3Selections.ephemeralContent.enabled = enabled.toLowerCase() === 'yes';

        // Parse Content Types
        const contentTypes = extractValue(ephemeralContent, 'Content Types');
        if (contentTypes) lv3Selections.ephemeralContent.contentTypes = splitValues(contentTypes);

        // Parse Content Visibility
        const visibility = extractValue(ephemeralContent, 'Content Visibility');
        if (visibility) lv3Selections.ephemeralContent.visibility = visibility.toLowerCase();

        // Parse Audience Settings
        const audience = extractValue(ephemeralContent, 'Audience Settings');
        if (audience) lv3Selections.ephemeralContent.audience = [audience.toLowerCase()];

        // Parse Content Visibility Control
        const visibilityControl = extractValue(ephemeralContent, 'Content Visibility Control');
        if (visibilityControl) lv3Selections.ephemeralContent.visibilityControl = [visibilityControl.toLowerCase()];
      }

      // Parse Content Discovery
      const discoveryMatch = lv3Content.match(/Content Discovery:([\s\S]*?)(?=\n\n|$)/i);
      if (discoveryMatch) {
        const discoveryContent = discoveryMatch[1];
        lv3Selections.contentDiscovery = {};

        // Parse Recommendations
        const recommendations = extractValue(discoveryContent, 'Recommendations');
        if (recommendations) lv3Selections.contentDiscovery.recommendations = [recommendations.toLowerCase()];

        // Parse Customization
        const customization = extractValue(discoveryContent, 'Customization');
        if (customization) lv3Selections.contentDiscovery.customization = [customization.toLowerCase()];

        // Parse Networking Control
        const networking = extractValue(lv3Content, 'Networking Control');
        if (networking) lv3Selections.networkingControl = splitValues(networking);

        // Parse Privacy Settings
        const privacy = extractValue(lv3Content, 'Privacy Settings');
        if (privacy) lv3Selections.privacySettings = privacy.toLowerCase();
      }

      // Parse Community Features
      const community = extractValue(lv3Content, 'Community Features');
      if (community) lv3Selections.communityFeature = community.toLowerCase();

      setSelections(prev => ({
        ...prev,
        lv3: lv3Selections
      }));
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
          {isLoading ? (
            <div className="loading-message">Processing your metaphor...</div>
          ) : (
            llmResponse && (
              <button
                className="simulation-button"
                onClick={() => handleGoToSimulation()}
              >
                Go to Simulation
              </button>
            )
          )}
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