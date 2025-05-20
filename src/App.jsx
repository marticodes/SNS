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

  const convertSelectionsToIntegers = (selections) => {
    const result = {
      timeline: 0,
      connection_type: 0,
      content_order: 0,
      commenting: 0,
      account_type: 0,
      identity: 0,
      messaging_mem: 0,
      messaging_control: 0,
      messaging_audience: 0,
      sharing: 0,
      reactions: 0,
      ephemerality: 0,
      visibility: 0,
      discovery: 0,
      networking_control: 0,
      privacy_default: 0,
      community_type: 0
    };

    // LV1 Conversions
    if (selections.type === 'feed-based') result.timeline = 1;
    else if (selections.type === 'chat-based') result.timeline = 2;

    if (selections.order === 'chronological') result.content_order = 1;
    else if (selections.order === 'algorithmic') result.content_order = 2;

    if (selections.connection === 'network-based') result.connection_type = 1;
    else if (selections.connection === 'group-based') result.connection_type = 2;

    // LV2 Conversions
    if (selections.lv2) {
      // Commenting
      if (selections.lv2.commenting === 'nested threads') result.commenting = 1;
      else if (selections.lv2.commenting === 'flat threads') result.commenting = 2;

      // Sharing   NOT USED IN THIS VERSION
      if (selections.lv2.sharing) {
        const hasDirect = selections.lv2.sharing.includes('direct');
        const hasPrivate = selections.lv2.sharing.includes('private');
        if (hasDirect && hasPrivate) result.sharing = 3;
        else if (hasDirect) result.sharing = 1;
        else if (hasPrivate) result.sharing = 2;
      }

      // Reactions
      if (selections.lv2.reactions === 'like') result.reactions = 1;
      else if (selections.lv2.reactions === 'upvote-downvote') result.reactions = 2;
      else if (selections.lv2.reactions === 'reactions') result.reactions = 3;

      // Account Types
      if (selections.lv2.accountTypes) {
        const hasPublic = selections.lv2.accountTypes.includes('public');
        const hasOneWay = selections.lv2.accountTypes.includes('private-one-way');
        const hasMutual = selections.lv2.accountTypes.includes('private-mutual');
        
        if (hasPublic && hasOneWay && hasMutual) result.account_type = 7;
        else if (hasOneWay && hasMutual) result.account_type = 6;
        else if (hasPublic && hasMutual) result.account_type = 5;
        else if (hasPublic && hasOneWay) result.account_type = 3;
        else if (hasMutual) result.account_type = 4;
        else if (hasOneWay) result.account_type = 2;
        else if (hasPublic) result.account_type = 1;
      }

      // Identity
      if (selections.lv2.identity === 'real-name') result.identity = 1;
      else if (selections.lv2.identity === 'pseudonymous') result.identity = 2;
      else if (selections.lv2.identity === 'anonymous') result.identity = 3;

      // Messaging Types
      if (selections.lv2.messagingTypes) {
        const hasPrivate = selections.lv2.messagingTypes.includes('private');
        const hasGroup = selections.lv2.messagingTypes.includes('group');
        if (hasPrivate && hasGroup) result.messaging_mem = 3;
        else if (hasPrivate) result.messaging_mem = 1;
        else if (hasGroup) result.messaging_mem = 2;
      }

      // Content Management
      if (selections.lv2.contentManagement) {
        const hasEdit = selections.lv2.contentManagement.includes('edit');
        const hasDelete = selections.lv2.contentManagement.includes('delete');
        if (hasEdit && hasDelete) result.messaging_control = 3;
        else if (hasEdit) result.messaging_control = 1;
        else if (hasDelete) result.messaging_control = 2;
      }

      // Audience
      if (selections.lv2.audience) {
        const hasEveryone = selections.lv2.audience.includes('everyone');
        const hasFriends = selections.lv2.audience.includes('with-connection');
        const hasMutual = selections.lv2.audience.includes('mutual');
        
        if (hasEveryone && hasFriends && hasMutual) result.messaging_audience = 7;
        else if (hasFriends && hasMutual) result.messaging_audience = 6;
        else if (hasEveryone && hasMutual) result.messaging_audience = 5;
        else if (hasEveryone && hasFriends) result.messaging_audience = 3;
        else if (hasMutual) result.messaging_audience = 4;
        else if (hasFriends) result.messaging_audience = 2;
        else if (hasEveryone) result.messaging_audience = 1;
      }
    }

    // LV3 Conversions
    if (selections.lv3) {
      // Ephemeral Content
      console.log('Debug - selections.lv3:', selections.lv3);
      if (selections.lv3.ephemeralContent) {
        result.ephemerality = selections.lv3.ephemeralContent.enabled ? 1 : 0;
      }

       // Content Visibility Control
       if (selections.lv3.visibilityControl) {
        const visibility = selections.lv3.visibilityControl[0];
        if (visibility === 'public') result.visibility = 1;
        else if (visibility === 'private') result.visibility = 3;
      }

      // Content Discovery
      if (selections.lv3.contentDiscovery) {
        if (selections.lv3.contentDiscovery.recommendations) {
          const recs = selections.lv3.contentDiscovery.recommendations;
          const hasTopic = recs.includes('topic-based');
          const hasPopular = recs.includes('popularity-based');
          if (hasTopic && hasPopular) result.discovery = 3;
          else if (hasTopic) result.discovery = 1;
          else if (hasPopular) result.discovery = 2;
        }
      }

      // Networking Control
      if (selections.lv3.networkingControl) {
        const hasBlock = selections.lv3.networkingControl.includes('block');
        const hasMute = selections.lv3.networkingControl.includes('mute');
        const hasHide = selections.lv3.networkingControl.includes('hide');
        
        if (hasBlock && hasMute && hasHide) result.networking_control = 7;
        else if (hasMute && hasHide) result.networking_control = 6;
        else if (hasBlock && hasHide) result.networking_control = 5;
        else if (hasBlock && hasMute) result.networking_control = 3;
        else if (hasHide) result.networking_control = 4;
        else if (hasMute) result.networking_control = 2;
        else if (hasBlock) result.networking_control = 1;
      }

      // Privacy Settings
      if (selections.lv3.privacySettings === 'invited-only') result.privacy_default = 1;
      else if (selections.lv3.privacySettings === 'show-all') result.privacy_default = 2;

      // Community Feature
      if (selections.lv3.communityFeature === 'open-groups') result.community_type = 1;
      else if (selections.lv3.communityFeature === 'closed-groups') result.community_type = 2;
    }

    return result;
  };

  const formatAttributesToText = (attributes) => {
    return Object.entries(attributes)
      .map(([key, value]) => `• ${key}: ${value}`)
      .join('\n');
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
      setLlmResponse(step3Data.features);
      
      // Parse the LLM response and update selections
      const newSelections = {};
      parseLLMResponse(step3Data.features, newSelections);
      
      // Convert selections to integers and send to backend
      const integerSelections = convertSelectionsToIntegers(newSelections);

      const myUserID = parseInt(localStorage.getItem("userID"), 10);

      // Send to backend
      const backendResponse = await fetch("http://localhost:3001/api/features/all/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...integerSelections,
          user_id: myUserID
        }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new Error(`Error sending to backend: ${backendResponse.statusText}. Details: ${errorText}`);
      }

      const backendData = await backendResponse.json();

      // Format attributes into bullet-pointed text
      const formattedAttributes = formatAttributesToText(step2Data.attributes);

      // Send metaphor data to backend
      const metaphorResponse = await fetch("http://localhost:3001/api/features/lvl/one/descriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: formData.metaphorKeyword,
          user_descr: description,
          llm_descr: formattedAttributes
        }),
      });

      if (!metaphorResponse.ok) {
        const errorText = await metaphorResponse.text();
        throw new Error(`Error sending metaphor data: ${metaphorResponse.statusText}. Details: ${errorText}`);
      }

      const metaphorData = await metaphorResponse.json();

      // Update the state after successful backend submission
      setSelections(newSelections);

    } catch (error) {
      console.error("Failed to process metaphor:", error);
      setLlmResponse(`An error occurred while processing your metaphor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const parseLLMResponse = (response, newSelections = {}) => {
    // Helper function to extract value from different formats
    const extractValue = (text, key) => {
      // Try different patterns
      const patterns = [
        new RegExp(`${key}:\\s*\\[(.*?)\\]`), // [value]
        new RegExp(`${key}:\\s*(.*?)(?=\\n|$)`), // value
        new RegExp(`${key}\\s*:\\s*(.*?)(?=\\n|$)`), // key : value
        new RegExp(`-\\s*${key}\\s*:\\s*(.*?)(?=\\n|$)`), // - key: value
        new RegExp(`${key}:\\s*([^\\n]+)`), // key: value (more permissive)
        new RegExp(`${key}\\s*:\\s*([^\\n]+)`), // key : value (more permissive)
        new RegExp(`-\\s*${key}\\s*:\\s*([^\\n]+)`), // - key: value (more permissive)
        new RegExp(`${key}:\\s*([^\\n]+)(?=\\n|$)`) // key: value (strict newline)
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
      if (type) newSelections.type = type.toLowerCase();

      // Parse Content Order
      const order = extractValue(lv1Content, 'Content Order');
      if (order) newSelections.order = order.toLowerCase();

      // Parse Connection Type
      const connection = extractValue(lv1Content, 'Connection Type');
      if (connection) newSelections.connection = connection.toLowerCase();
    }

    // Parse LV2 selections
    const lv2Match = response.match(/Interaction Mechanisms([\s\S]*?)(?=Advanced Features|$)/i);
    if (lv2Match) {
      const lv2Content = lv2Match[1];
      newSelections.lv2 = {};

      // Parse Commenting
      const commenting = extractValue(lv2Content, 'Commenting');
      if (commenting) {
        const commentText = commenting.toLowerCase().trim();
        if (commentText.includes('nested')) {
          newSelections.lv2.commenting = 'nested threads';
        } else if (commentText.includes('flat')) {
          newSelections.lv2.commenting = 'flat threads';
        }
      }

      // Parse Sharing
      const sharing = extractValue(lv2Content, 'Sharing');
      if (sharing) {
        const sharingText = sharing.toLowerCase().trim();
        if (sharingText.includes('direct')) {
          newSelections.lv2.sharing = ['direct'];
        } else if (sharingText.includes('private')) {
          newSelections.lv2.sharing = ['private'];
        }
      }

      // Parse Reactions
      const reactions = extractValue(lv2Content, 'Reactions');
      if (reactions) {
        const reactionText = reactions.toLowerCase().trim();
        if (reactionText.includes('expanded')) {
          newSelections.lv2.reactions = 'reactions';
        } else if (reactionText.includes('like')) {
          newSelections.lv2.reactions = 'like';
        } else if (reactionText.includes('upvote') || reactionText.includes('downvote')) {
          newSelections.lv2.reactions = 'upvote-downvote';
        }
      }

      // Parse Content Management
      const management = extractValue(lv2Content, 'Content Management');
      if (management) {
        const managementText = management.toLowerCase().trim();
        const managementOptions = managementText.split(',').map(opt => opt.trim());
        newSelections.lv2.contentManagement = [];
        
        if (managementOptions.includes('edit')) {
          newSelections.lv2.contentManagement.push('edit');
        }
        if (managementOptions.includes('delete')) {
          newSelections.lv2.contentManagement.push('delete');
        }
      }

      // Parse Account Types
      const accountTypes = extractValue(lv2Content, 'Account Types');
      if (accountTypes) {
        const accountText = accountTypes.toLowerCase().trim();
        if (accountText.includes('public')) {
          newSelections.lv2.accountTypes = ['public'];
        } else if (accountText.includes('private') && accountText.includes('one-way')) {
          newSelections.lv2.accountTypes = ['private-one-way'];
        } else if (accountText.includes('private') && accountText.includes('mutual')) {
          newSelections.lv2.accountTypes = ['private-mutual'];
        }
      }

      // Parse Identity Options
      const identity = extractValue(lv2Content, 'Identity Options');
      if (identity) {
        const identityText = identity.toLowerCase().trim();
        if (identityText.includes('real-name') || identityText.includes('real name')) {
          newSelections.lv2.identity = 'real-name';
        } else if (identityText.includes('pseudonym')) {
          newSelections.lv2.identity = 'pseudonymous';
        } else if (identityText.includes('anonym')) {
          newSelections.lv2.identity = 'anonymous';
        }
      }

      // Parse Messaging
      const messagingMatch = lv2Content.match(/Messaging:([\s\S]*?)(?=\n\n|$)/i);
      if (messagingMatch) {
        const messagingContent = messagingMatch[1];
        
        // Parse Types
        const types = extractValue(messagingContent, 'Types');
        if (types) {
          const typesText = types.toLowerCase().trim();
          const typeOptions = typesText.split(',').map(opt => opt.trim());
          newSelections.lv2.messagingTypes = [];
          
          if (typeOptions.some(opt => opt.includes('private') || opt.includes('one-on-one'))) {
            newSelections.lv2.messagingTypes.push('private');
          }
          if (typeOptions.some(opt => opt.includes('group'))) {
            newSelections.lv2.messagingTypes.push('group');
          }
        }

        // Parse Audience
        const audience = extractValue(messagingContent, 'Audience');
        if (audience) {
          const audienceText = audience.toLowerCase().trim();
          if (audienceText.includes('everyone')) {
            newSelections.lv2.audience = ['everyone'];
          } else if (audienceText.includes('connection')) {
            newSelections.lv2.audience = ['with-connection'];
          }
        }
      }
    }

    // Parse LV3 selections
    const lv3Match = response.match(/Advanced Features & Customization([\s\S]*?)(?=\n\n|$)/i);
    if (lv3Match) {
      const lv3Content = lv3Match[1];
      newSelections.lv3 = {};

      // Parse Ephemeral Content
      const ephemeralContent = extractValue(lv3Content, 'Ephemeral Content');
      if (ephemeralContent) {
        const ephemeralText = ephemeralContent.toLowerCase().trim();
        newSelections.lv3.ephemeralContent = {
          enabled: ephemeralText.includes('yes'),
          contentTypes: ephemeralText.includes('yes') ? ['yes'] : ['no']
        };
      }

      // Parse Content Visibility Control
      const visibilityControl = extractValue(lv3Content, 'Content Visibility Control');
      if (visibilityControl) {
        const visibilityText = visibilityControl.toLowerCase().trim();

        const visibilityOptions = visibilityText.split(',').map(opt => opt.trim());
        newSelections.lv3.visibilityControl = [];
        
        if (visibilityOptions.some(opt => opt.includes('specific'))) {
          newSelections.lv3.visibilityControl.push('specific-groups');
        }
        if (visibilityOptions.some(opt => opt.includes('public'))) {
          newSelections.lv3.visibilityControl.push('public');
        }
        if (visibilityOptions.some(opt => opt.includes('private'))) {
          newSelections.lv3.visibilityControl.push('private');
        }
      }

      // Parse Content Discovery
      const discoveryMatch = lv3Content.match(/Content Discovery:([\s\S]*?)(?=\n\n|$)/i);
      if (discoveryMatch) {
        const discoveryContent = discoveryMatch[1];
        newSelections.lv3.contentDiscovery = {};

        // Parse Recommendations
        const recommendations = extractValue(discoveryContent, 'Recommendations');
        if (recommendations) {
          const recText = recommendations.toLowerCase().trim();
          if (recText.includes('topic')) {
            newSelections.lv3.contentDiscovery.recommendations = ['topic-based'];
          } else if (recText.includes('popular')) {
            newSelections.lv3.contentDiscovery.recommendations = ['popularity-based'];
          }
        }

        // Parse Networking Control
        const networking = extractValue(discoveryContent, 'Networking Control');
        if (networking) {
          const networkingText = networking.toLowerCase().trim();
          if (networkingText.includes('block')) {
            newSelections.lv3.networkingControl = ['block'];
          } else if (networkingText.includes('mute')) {
            newSelections.lv3.networkingControl = ['mute'];
          }
        }

        // Parse Privacy Settings
        const privacy = extractValue(discoveryContent, 'Privacy Settings');
        if (privacy) {
          const privacyText = privacy.toLowerCase().trim();
          if (privacyText.includes('show all') || privacyText.includes('show-all')) {
            newSelections.lv3.privacySettings = 'show-all';
          } else if (privacyText.includes('invited')) {
            newSelections.lv3.privacySettings = 'invited-only';
          }
        }

        // Parse Community Features
        const community = extractValue(discoveryContent, 'Community Features');
        if (community) {
          const communityText = community.toLowerCase().trim();
          if (communityText.includes('open')) {
            newSelections.lv3.communityFeature = 'open-groups';
          } else if (communityText.includes('closed')) {
            newSelections.lv3.communityFeature = 'closed-groups';
          }
        }
      }
    }

    return newSelections;
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