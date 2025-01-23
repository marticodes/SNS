import React from 'react';

const ChatMessage = ({ username, avatar, message, time }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'flex-start' }}>
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{username}</span>
          <span style={{ fontSize: '12px', color: 'black' }}>{time}</span>
        </div>
        <div style={{ lineHeight: '1.5', color: 'black' }}>{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
