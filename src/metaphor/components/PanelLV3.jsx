import React from "react";

function PanelLV3({ selections }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="title-and-icon">
          <h3>LV3</h3>
        </div>
      </div>

      <h3>Ephemeral content</h3>

      <div className="options">
        <label>
          <input type="checkbox" checked={selections?.ephemeralContent?.contentTypes?.includes('yes')} disabled={true}/> Yes
        </label>
        <label>
          <input type="checkbox" checked={selections?.ephemeralContent?.contentTypes?.includes('no')} disabled={true}/> No
        </label>
      </div>

      <div className="options">
        <h3>Content visibility control</h3>
        <label>
          <input type="checkbox" checked={selections?.ephemeralContent?.visibilityControl?.includes('public')} disabled={true}/> Public
        </label>
        <label>
          <input type="checkbox" checked={selections?.ephemeralContent?.visibilityControl?.includes('private')} disabled={true}/> Private
        </label>
      </div>

      <h3>Content discovery</h3>

      <div className="options">
        <strong>Recommendations</strong>
        <label>
          <input type="checkbox" checked={selections?.contentDiscovery?.recommendations?.includes('topic-based')} disabled={true}/> Topic-based suggestion
        </label>
        <label>
          <input type="checkbox" checked={selections?.contentDiscovery?.recommendations?.includes('popularity-based')} disabled={true}/> Popularity-based suggestion
        </label>
      </div>

      <div className="options">
        <h3>Networking control</h3>
        <label>
          <input type="checkbox" checked={selections?.networkingControl?.includes('block')} disabled={true}/> Block
        </label>
        <label>
          <input type="checkbox" checked={selections?.networkingControl?.includes('mute')} disabled={true}/> Mute
        </label>
      </div>

      <div className="options">
        <h3>Privacy settings</h3>
        <label>
          <input type="radio" name="privacySettings" checked={selections?.privacySettings === 'invited-only'} disabled={true}/> Invited contents only (e.g., Slack)
        </label>
        <label>
          <input type="radio" name="privacySettings" checked={selections?.privacySettings === 'show-all'} disabled={true}/> Show all (e.g., Instagram)
        </label>
      </div>

      <div className="options">
        <h3>Community feature</h3>
        <label>
          <input type="radio" name="communityFeature" checked={selections?.communityFeature === 'open-groups'} disabled={true}/> Open groups (e.g., Instagram)
        </label>
        <label>
          <input type="radio" name="communityFeature" checked={selections?.communityFeature === 'closed-groups'} disabled={true}/> Closed groups (e.g., Facebook)
        </label>
      </div>
    </div>
  );
}

export default PanelLV3; 