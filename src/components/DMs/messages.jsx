import React, { useEffect, useRef } from "react";
import SingleMessage from "./oneMessage";
import GroupMessage from "./groupMessage";

const myID = parseInt(localStorage.getItem("userID"), 10);

const MessageList = ({ messages, onReply, isGroup, chatId }) => {
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
      {isGroup
        ? messages.map((message) => (
            <GroupMessage
              message={message}
              chatId={chatId}
              isCurrentUser={message.sender === Number(myID)}
              onReply={(msg) => onReply(msg)}
            />
          ))
        : messages.map((message) => (
            <SingleMessage
              message={message}
              chatId = {chatId}
              isCurrentUser={message.sender === Number(myID)}
              onReply={(msg) => onReply(msg)}
            />
          ))}
    </div>
  );
};

export default MessageList;


