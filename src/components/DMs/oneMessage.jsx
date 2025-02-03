import React from "react";

const formatTimestamp = (timestamp) => {
  // Format timestamp as "HH:MM" in 24-hour format
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const SingleMessage = ({ message, isCurrentUser, onMessageClick }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        margin: "10px 0",
      }}
    >
      <div
        onClick={onMessageClick} // Trigger reply action when clicked
        style={{
          maxWidth: "70%", // Limit width to make it look more like a chat bubble
          padding: "10px",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#E4E6EB",
          color: isCurrentUser ? "#fff" : "#000",
          borderRadius: "15px",
          borderTopLeftRadius: isCurrentUser ? "15px" : "0px",
          borderTopRightRadius: isCurrentUser ? "0px" : "15px",
          cursor: "pointer",
        }}
      >
        {message.replyTo && (
          <div
            style={{
              fontStyle: "italic",
              color: isCurrentUser ? "#fff" : "#333",  // Change text color based on background color
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            Reply to {message.replyTo.sender}: {message.replyTo.text}
          </div>
        )}
        <div style={{ fontSize: "16px", lineHeight: "1.5" }}>{message.text}</div>
        <div
          style={{
            fontSize: "12px",
            marginTop: "5px",
            textAlign: "right",
            color: isCurrentUser ? "#B0C4DE" : "#555",
          }}
        >
          {(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;

