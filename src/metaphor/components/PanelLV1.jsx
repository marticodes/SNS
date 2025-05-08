import React, { useState } from "react";

function PanelLV1({ onSelectionChange }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    onSelectionChange('type', e.target.value);
  };

  const handleOrderChange = (e) => {
    setSelectedOrder(e.target.value);
    onSelectionChange('order', e.target.value);
  };

  const handleConnectionChange = (e) => {
    setSelectedConnection(e.target.value);
    onSelectionChange('connection', e.target.value);
  };

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
            checked={selectedType === 'feed-based'}
            onChange={handleTypeChange}
          />
          Feed-based
        </label>
        <label>
          <input
            type="radio"
            name="timelineType"
            value="channel-based"
            checked={selectedType === 'channel-based'}
            onChange={handleTypeChange}
          />
          Channel-based
        </label>
      </div>

      <div className="options">
        <strong>Content Order</strong>
        <label>
          <input
            type="radio"
            name="contentOrder"
            value="chronological"
            checked={selectedOrder === 'chronological'}
            onChange={handleOrderChange}
          />
          Chronological
        </label>
        <label>
          <input
            type="radio"
            name="contentOrder"
            value="algorithmic"
            checked={selectedOrder === 'algorithmic'}
            onChange={handleOrderChange}
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
            checked={selectedConnection === 'network'}
            onChange={handleConnectionChange}
            /> 
          Network
        </label>
        <label>
          <input 
            type="radio" 
            name="connectionType"
            value="group"
            checked={selectedConnection === 'group'}
            onChange={handleConnectionChange} 
          /> 
          Group
        </label>
      </div>
    </div>
  );
}

export default PanelLV1; 