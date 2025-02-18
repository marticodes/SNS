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
        alignItems: "flex-start",
        margin: "10px 0",
        gap: "10px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#E4E6EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: isCurrentUser ? "#fff" : "#000",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {message.sender[0].toUpperCase()}
      </div>

      {/* Message Content */}
      <div style={{ maxWidth: "75%" }}>
        {/* Sender Name */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: isCurrentUser ? "#7CB9E8" : "#555",
            marginBottom: "3px",
          }}
        >
          {message.sender}{" "}
          <span style={{ fontSize: "12px", color: "#999", marginLeft: "5px" }}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          onClick={onMessageClick}
          style={{
            padding: "10px",
            backgroundColor: isCurrentUser ? "#D1E7FF" : "#F2F3F5",
            color: isCurrentUser ? "#000" : "#000",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: "1.4",
            position: "relative",
          }}
        >
          {message.replyTo && (
            <div
              style={{
                fontStyle: "italic",
                color: "#555",
                marginBottom: "5px",
                fontSize: "14px",
                borderLeft: "2px solid #7CB9E8",
                paddingLeft: "8px",
              }}
            >
              Reply to {message.replyTo.sender}: {message.replyTo.text}
            </div>
          )}
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;