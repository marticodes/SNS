import React, { useEffect, useRef } from "react";
import SingleMessage from "./oneMessage";

//change to add also group messages

const MessageList = ({ messages, currentUser, onReply, onReact }) => {
  const messageListRef = useRef(null); 

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messageListRef} 
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
          onReply={onReply} 
          onReact={onReact} 
        />
      ))}
    </div>
  );
};

export default MessageList;


