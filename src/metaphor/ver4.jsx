import React, { useState } from "react";
import "./ver4.css";

const MetaphorPrompt = ({ onSubmit, onSaveDescription, page = 1 }) => {
  const [formData, setFormData] = useState({
    metaphorKeyword: "",
    atmosphere: "",
    reasonForGathering: "",
    connectionStyle: "",
    durationOfParticipation: "",
    communicationStyle: "",
    identityType: "",
    interactionGoal: "",
    participationControl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeywordSubmit = (e) => {
    e.preventDefault();
    // Only send the keyword to LLM
    onSubmit({ metaphorKeyword: formData.metaphorKeyword });
  };

  const handleDescriptionSubmit = (e) => {
    e.preventDefault();
    // Send the full description to backend
    onSaveDescription(formData);
  };

  return (
    <div className="metaphor-prompt-container">
      <form className="metaphor-form">
        {page === 1 && (
          <>
            <h3>Metaphor Input</h3>
            <div className="metaphor-keyword">
              <label htmlFor="metaphorKeyword">Metaphor Keyword:</label>
              <input
                type="text"
                id="metaphorKeyword"
                name="metaphorKeyword"
                value={formData.metaphorKeyword}
                onChange={handleChange}
                placeholder="Enter your metaphor keyword"
                className="input-blank"
              />
            </div>
            <button type="button" onClick={handleKeywordSubmit} className="submit-button">Send keyword to LLM</button>
          </>
        )}

        {page === 2 && (
          <>
            <h4>Metaphor Description</h4>
            <p>
              In a space that feels 
              <input 
                type="text" 
                name="atmosphere" 
                value={formData.atmosphere} 
                onChange={handleChange} 
                placeholder="atmosphere" 
                className="input-blank"
              />, 
              people come together 
              <input 
                type="text" 
                name="reasonForGathering" 
                value={formData.reasonForGathering} 
                onChange={handleChange} 
                placeholder="reason for gathering" 
                className="input-blank"
              /> 
              , often connecting 
              <input 
                type="text" 
                name="connectionStyle" 
                value={formData.connectionStyle} 
                onChange={handleChange} 
                placeholder="connection style" 
                className="input-blank"
              />. 
              They usually 
              <input 
                type="text" 
                name="durationOfParticipation" 
                value={formData.durationOfParticipation} 
                onChange={handleChange} 
                placeholder="duration of participation" 
                className="input-blank"
              />, 
              interact through 
              <input 
                type="text" 
                name="communicationStyle" 
                value={formData.communicationStyle} 
                onChange={handleChange} 
                placeholder="communication style" 
                className="input-blank"
              />, 
              and present themselves using 
              <input 
                type="text" 
                name="identityType" 
                value={formData.identityType} 
                onChange={handleChange} 
                placeholder="identity type" 
                className="input-blank"
              />. 
              Most people are here to 
              <input 
                type="text" 
                name="interactionGoal" 
                value={formData.interactionGoal} 
                onChange={handleChange} 
                placeholder="interaction goal" 
                className="input-blank"
              />, 
              and they have the option to 
              <input 
                type="text" 
                name="participationControl" 
                value={formData.participationControl} 
                onChange={handleChange} 
                placeholder="control over participation/visibility" 
                className="input-blank"
              />.
            </p>
            <button type="button" onClick={handleDescriptionSubmit} className="submit-button">Save the description</button>
          </>
        )}
      </form>
    </div>
  );
};

export default MetaphorPrompt;
