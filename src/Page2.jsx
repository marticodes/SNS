import "./App.css";
import "./Page2.css";
import MetaphorPrompt from "./metaphor/ver4";
import PanelLV1 from "./metaphor/components/PanelLV1";
import PanelLV2 from "./metaphor/components/PanelLV2";
import PanelLV3 from "./metaphor/components/PanelLV3";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Page2() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selections, setSelections] = useState({
    type: null,
    order: null,
    connection: null,
    lv2: null,
    lv3: null
  });

  const handleSaveDescription = async (formData) => {
    setIsLoading(true);
    setIsSaved(false);
    try {
      // Create a formatted description from the form data
      const narrativeDescription = `In a space that feels ${formData.atmosphere}, people come together ${formData.reasonForGathering}, often connecting ${formData.connectionStyle}. They usually ${formData.durationOfParticipation}, interact through ${formData.communicationStyle}, and present themselves using ${formData.identityType}. Most people are here to ${formData.interactionGoal}, and they have the option to ${formData.participationControl}.`;

      // Create structured attributes description
      const structuredAttributes = `• Atmosphere: ${formData.atmosphere}
      • GatheringType: ${formData.reasonForGathering}
      • ConnectingEnvironment: ${formData.connectionStyle}
      • TemporalEngagement: ${formData.durationOfParticipation}
      • CommunicationFlow: ${formData.communicationStyle}
      • ActorType: ${formData.identityType}
      • ContentOrientation: ${formData.interactionGoal}
      • ParticipationControl: ${formData.participationControl}`;

      // Combine both descriptions
      const fullDescription = `${narrativeDescription}\n\nStructured Attributes:\n${structuredAttributes}`;

      // Send metaphor data to backend
      const metaphorResponse = await fetch("http://localhost:3001/api/features/lvl/one/descriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_descr: fullDescription,
        }),
      });

      if (!metaphorResponse.ok) {
        const errorText = await metaphorResponse.text();
        throw new Error(`Error sending metaphor data: ${metaphorResponse.statusText}. Details: ${errorText}`);
      }

      const metaphorData = await metaphorResponse.json();
      console.log('Saved description:', metaphorData);
      setIsSaved(true);

    } catch (error) {
      console.error("Failed to save description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaphorSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Create a formatted description from the form data
      const description = `In a space that feels ${formData.atmosphere}, people come together ${formData.reasonForGathering}, often connecting ${formData.connectionStyle}. They usually ${formData.durationOfParticipation}, interact through ${formData.communicationStyle}, and present themselves using ${formData.identityType}. Most people are here to ${formData.interactionGoal}, and they have the option to ${formData.participationControl}.`;

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
      setLlmResponse(step3Data.features);
      
      // Parse the LLM response and update selections
      const newSelections = {};
      parseLLMResponse(step3Data.features, newSelections);
      
      // Convert selections to integers and send to backend
      const integerSelections = convertSelectionsToIntegers(newSelections);

      // Send to backend
      const backendResponse = await fetch("http://localhost:3001/api/features/all/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...integerSelections,
        }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Error sending to backend: ${backendResponse.statusText}. Details: ${errorText}`);
      }

      const backendData = await backendResponse.json();
      
      // Update the state after successful backend submission
      setSelections(newSelections);

    } catch (error) {
      console.error("Failed to process metaphor:", error);
      setLlmResponse(`An error occurred while processing your metaphor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load selections from localStorage when component mounts
  useEffect(() => {
    console.log("Page2 mounted - checking localStorage");
    const loadSelections = () => {
      const savedSelections = localStorage.getItem('snsSelections');
      console.log("Page2 - Raw savedSelections from localStorage:", savedSelections);
      if (savedSelections) {
        try {
          const parsedSelections = JSON.parse(savedSelections);
          console.log("Page2 - Parsed selections:", parsedSelections);
          // Only set selections if they're not null
          if (parsedSelections.type !== null) {
            setSelections(parsedSelections);
          }
        } catch (error) {
          console.error('Error loading selections from localStorage:', error);
        }
      }
    };

    // Load initial selections
    loadSelections();

    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = (e) => {
      console.log("Page2 - Storage event:", e.key, e.newValue);
      if (e.key === 'snsSelections') {
        loadSelections();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update localStorage when selections change, but only if we have valid data
  useEffect(() => {
    if (selections.type !== null) {
      console.log("Page2 - Updating localStorage with selections:", selections);
      localStorage.setItem('snsSelections', JSON.stringify(selections));
    }
  }, [selections]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SNS Simulation</h1>
      </header>
      <main>
        <div className="metaphor-section">
          <MetaphorPrompt onSubmit={handleMetaphorSubmit} onSaveDescription={handleSaveDescription} page={2} />
          {isLoading ? (
            <div className="loading-message">Saving your metaphor...</div>
          ) : (
            isSaved && (
              <button
                className="simulation-buttonn"
                onClick={() => navigate("/3")}
              >
                Go to Next Page
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Page2;