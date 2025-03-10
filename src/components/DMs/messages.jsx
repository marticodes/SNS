import React, { useEffect, useRef } from "react";
import SingleMessage from "./oneMessage";

const myID = parseInt(localStorage.getItem("userID"), 10);
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
      {messages.map((message) => (
        <SingleMessage
          message={message}
          isCurrentUser={message.sender === Number(myID)}
          onReply={(msg) => onReply(msg)} 
          onReact={onReact}
        />
      ))}
    </div>
  );
};

export default MessageList;


