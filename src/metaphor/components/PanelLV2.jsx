import React from "react";

function PanelLV2({ selections }) {
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
          <input 
            type="checkbox" 
            checked={selections?.contentTypes?.includes('text') || selections?.contentTypes?.includes('both')} 
            data-both={selections?.contentTypes?.includes('both')}
            disabled={true}
          /> Text
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={selections?.contentTypes?.includes('image') || selections?.contentTypes?.includes('both')} 
            data-both={selections?.contentTypes?.includes('both')}
            disabled={true}
          /> Image
        </label>
      </div>

      <div className="options">
        <strong>Commenting</strong>
        <label>
          <input type="radio" name="commenting" checked={selections?.commenting === 'nested threads'} disabled={true}/> Nested threads
        </label>
        <label>
          <input type="radio" name="commenting" checked={selections?.commenting === 'flat threads'} disabled={true}/> Flat threads
        </label>
      </div>

      <div className="options">
        <strong>Sharing</strong>
        <label>
          <input type="checkbox" checked={selections?.sharing?.includes('direct')} disabled={true}/> Direct (e.g., reposts)
        </label>
        <label>
          <input type="checkbox" checked={selections?.sharing?.includes('private')} disabled={true}/> Private (e.g., messages)
        </label>
      </div>

      <div className="options">
        <strong>Reactions</strong>
        <label>
          <input type="radio" name="reactions" checked={selections?.reactions === 'like'} disabled={true}/> Like
        </label>
        <label>
          <input type="radio" name="reactions" checked={selections?.reactions === 'upvote-downvote'} disabled={true}/> Upvote/Downvote
        </label>
        <label>
          <input type="radio" name="reactions" checked={selections?.reactions === 'reactions'} disabled={true}/> Expanded reactions
        </label>
      </div>

      <h3>Account</h3>

      <div className="options">
        <strong>Types</strong>
        <label>
          <input type="checkbox" checked={selections?.accountTypes?.includes('public')} disabled={true}/> Public
        </label>
        <label>
          <input type="checkbox" checked={selections?.accountTypes?.includes('private-one-way')} disabled={true}/> Private (one-way)
        </label>
        <label>
          <input type="checkbox" checked={selections?.accountTypes?.includes('private-mutual')} disabled={true}/> Private (mutual)
        </label>
      </div>

      <div className="options">
        <strong>Identity</strong>
        <label>
          <input type="radio" name="identity" checked={selections?.identity === 'real-name'} disabled={true}/> Real-name
        </label>
        <label>
          <input type="radio" name="identity" checked={selections?.identity === 'pseudonymous'} disabled={true}/> Pseudonymous
        </label>
        <label>
          <input type="radio" name="identity" checked={selections?.identity === 'anonymous'} disabled={true}/> Anonymous
        </label>
      </div>

      <h3>Messaging</h3>

      <div className="options">
        <strong>Types</strong>
        <label>
          <input type="checkbox" checked={selections?.messagingTypes?.includes('private')} disabled={true}/> Private(1:1)
        </label>
        <label>
          <input type="checkbox" checked={selections?.messagingTypes?.includes('group')} disabled={true}/> Group
        </label>
      </div>

      <div className="options">
        <strong>Content</strong>
        <label>
          <input type="checkbox" checked={selections?.messagingContent?.includes('text')} disabled={true}/> Text
        </label>
        <label>
          <input type="checkbox" checked={selections?.messagingContent?.includes('posts')} disabled={true}/> Posts
        </label>
        <label>
          <input type="checkbox" checked={selections?.messagingContent?.includes('stories')} disabled={true}/> Stories
        </label>
      </div>

      <div className="options">
        <strong>Content Management</strong>
        <label>
          <input type="checkbox" checked={selections?.contentManagement?.includes('edit')} disabled={true}/> Edit
        </label>
        <label>
          <input type="checkbox" checked={selections?.contentManagement?.includes('delete')} disabled={true}/> Delete
        </label>
      </div>

      <div className="options">
        <strong>Audience</strong>
        <label>
          <input type="checkbox" checked={selections?.audience?.includes('everyone')} disabled={true}/> Everyone
        </label>
        <label>
          <input type="checkbox" checked={selections?.audience?.includes('friends-only')} disabled={true}/> Friends-only
        </label>
        <label>
          <input type="checkbox" checked={selections?.audience?.includes('mutual-connections')} disabled={true}/> Mutual connections
        </label>
      </div>
    </div>
  );
}

export default PanelLV2; 