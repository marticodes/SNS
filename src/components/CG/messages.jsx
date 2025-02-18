import React, { useEffect, useRef } from "react";
import SingleMessage from "./oneMessage";

const MessageList = ({ messages, onReply, onReact }) => {
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
          onReply={onReply} // Pass reply handler
          onReact={onReact} // Pass reaction handler
        />
      ))}
    </div>
  );
};

export default MessageList;


