import React from "react";

const ChatHeader = ({ currentChatUser }) => {
  return (
    <div style={{ display: "flex", padding: "10px 20px", backgroundColor: 'blue'}}>
      <h2 style={{ margin: 0 }}>{currentChatUser || "."}</h2>
    </div>
  );
};

export default ChatHeader;
