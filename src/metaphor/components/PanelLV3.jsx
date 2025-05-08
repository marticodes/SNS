import React from "react";

function PanelLV3({ selectedConnection }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="title-and-icon">
          <h3>LV3</h3>
        </div>
      </div>

      <h3>Ephemeral content</h3>

      <div className="options">
        <strong>Content Type</strong>
        <label>
          <input type="checkbox" disabled={true}/> Text
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Image
        </label>
      </div>

      <div className="options">
        <strong>Content visibility</strong>
        <label>
          <input type="radio" name="contentVisibility" disabled={true}/> Preview
        </label>
        <label>
          <input type="radio" name="contentVisibility" disabled={true}/> Non-preview
        </label>
      </div>

      <div className="options">
        <strong>Audience</strong>
        <label>
          <input type="checkbox" disabled={true}/> Show seen users
        </label>
      </div>

      <div className="options">
        <h3>Content visibility control</h3>
        <label>
          <input type="checkbox" disabled={true}/> Public
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Specific groups (e.g., close friends)
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Private
        </label>
      </div>

      <h3>Content discovery</h3>

      <div className="options">
        <strong>Recommendations</strong>
        <label>
          <input type="checkbox" disabled={true}/> Topic-based suggestion
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Popularity-based suggestion
        </label>
      </div>

      <div className="options">
        <strong>Customization</strong>
        <label>
          <input type="checkbox" disabled={true}/> User-defined content filters (e.g., mute keywords, hide suggested contents, ..)
        </label>
      </div>

      <div className="options">
        <h3>Networking control</h3>
        <label>
          <input type="checkbox" disabled={true}/> Block
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Mute
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Hide
        </label>
      </div>

      <div className="options">
        <h3>Privacy settings</h3>
        <label>
          <input type="radio" name="privacySettings" disabled={true}/> Invited contents only (e.g., Slack)
        </label>
        <label>
          <input type="radio" name="privacySettings" disabled={true}/> Show all (e.g., Instagram)
        </label>
      </div>

      <div className="options">
        <h3>Community feature</h3>
        <label>
          <input type="radio" name="communityFeature" disabled={true}/> Open groups (e.g., Instagram)
        </label>
        <label>
          <input type="radio" name="communityFeature" disabled={true}/> Closed groups (e.g., Facebook)
        </label>
      </div>
    </div>
  );
}

export default PanelLV3; 