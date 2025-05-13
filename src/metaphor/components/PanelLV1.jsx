import React from "react";

function PanelLV1({ selections }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="title-and-icon">
          <h3>LV1</h3>
        </div>
      </div>
      <h3>Timeline</h3>
      <div className="options">
        <strong>Types</strong>
        <label>
          <input
            type="radio"
            name="timelineType"
            value="feed-based"
            checked={selections?.type === 'feed-based'}
            disabled={true}
          />
          Feed-based
        </label>
        <label>
          <input
            type="radio"
            name="timelineType"
            value="chat-based"
            checked={selections?.type === 'chat-based'}
            disabled={true}
          />
          Chat-based
        </label>
      </div>

      <div className="options">
        <strong>Content Order</strong>
        <label>
          <input
            type="radio"
            name="contentOrder"
            value="chronological"
            checked={selections?.order === 'chronological'}
            disabled={true}
          />
          Chronological
        </label>
        <label>
          <input
            type="radio"
            name="contentOrder"
            value="algorithmic"
            checked={selections?.order === 'algorithmic'}
            disabled={true}
          />
          Algorithmic
        </label>
      </div>

      <div className="options">
        <h3>Connection type</h3>
        <label>
          <input 
            type="radio"
            name="connectionType" 
            value="network"
            checked={selections?.connection === 'network-based'}
            disabled={true}
          /> 
          Network
        </label>
        <label>
          <input 
            type="radio" 
            name="connectionType"
            value="group"
            checked={selections?.connection === 'group-based'}
            disabled={true}
          /> 
          Group
        </label>
      </div>
    </div>
  );
}

export default PanelLV1; 