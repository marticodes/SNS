import React from "react";

const ChatHeader = ({ currentChatUser }) => {
  return (
    <div style={{ display: "flex", padding: "10px 20px", backgroundColor: "#fff", borderBottom: "0.1px solid #B0BEC5" }}>
      <h2 style={{ margin: 0, color: '#032F50'}}>{currentChatUser || "."}</h2>
    </div>
  );
};

export default ChatHeader;
