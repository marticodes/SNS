import React from "react";

function PanelLV2() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="title-and-icon">
          <h3>LV2</h3>
        </div>
      </div>

      <div className="options">
        <h3>Content</h3>
        <label>
          <input type="checkbox" disabled={true}/> Text
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Image
        </label>
      </div>

      <div className="options">
        <strong>Commenting</strong>
        <label>
          <input type="radio" name="commenting" disabled={true}/> Nested threads
        </label>
        <label>
          <input type="radio" name="commenting" disabled={true}/> Flat threads
        </label>
      </div>

      <div className="options">
        <strong>Sharing</strong>
        <label>
          <input type="checkbox" disabled={true}/> Direct (e.g., reposts)
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Private (e.g., messages)
        </label>
      </div>

      <div className="options">
        <strong>Reactions</strong>
        <label>
          <input type="radio" name="reactions" disabled={true}/> Like
        </label>
        <label>
          <input type="radio" name="reactions" disabled={true}/> Upvote/Downvote
        </label>
        <label>
          <input type="radio" name="reactions" disabled={true}/> Expanded reactions
        </label>
      </div>

      <h3>Account</h3>

      <div className="options">
        <strong>Types</strong>
        <label>
          <input type="checkbox" disabled={true}/> Public
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Private (one-way)
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Private (mutual)
        </label>
      </div>

      <div className="options">
        <strong>Identity</strong>
        <label>
          <input type="radio" name="identity" disabled={true}/> Real-name
        </label>
        <label>
          <input type="radio" name="identity" disabled={true}/> Pseudonymous
        </label>
        <label>
          <input type="radio" name="identity" disabled={true}/> Anonymous
        </label>
      </div>

      <h3>Messaging</h3>

      <div className="options">
        <strong>Types</strong>
        <label>
          <input type="checkbox" disabled={true}/> Private(1:1)
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Group
        </label>
      </div>

      <div className="options">
        <strong>Content</strong>
        <label>
          <input type="checkbox" disabled={true}/> Text
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Posts
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Stories
        </label>
      </div>

      <div className="options">
        <strong>Content</strong>
        <label>
          <input type="checkbox" disabled={true}/> Edit
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Delete
        </label>
      </div>

      <div className="options">
        <strong>Subject</strong>
        <label>
          <input type="checkbox" disabled={true}/> Everyone
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Friends-only
        </label>
        <label>
          <input type="checkbox" disabled={true}/> Mutual connections
        </label>
      </div>
    </div>
  );
}

export default PanelLV2; 