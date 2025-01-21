import React from "react";
import SingleMessage from "./oneMessage";

const MessageList = ({ messages, currentUser }) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto", 
        padding: "10px", 
        backgroundColor: "#fff",
      }}
    >
      {messages.map((message, index) => (
        <SingleMessage
          key={index}
          message={message}
          isCurrentUser={message.sender === currentUser}
        />
      ))}
    </div>
  );
};

export default MessageList;

