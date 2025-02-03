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
        backgroundColor: "#E4E6EB", // Neutral background color as fallback
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#000", // Text color
        fontWeight: "bold",
        fontSize: "14px",
        overflow: "hidden", // To ensure the image is contained within the circle
      }}
    >
      <img
        src={`https://i.pravatar.cc/40?u=${message.sender}`} // CHANGE THIS WITH ACTUAL PIC
        alt="User Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Ensures the image covers the area without stretching
        }}
      />
    </div>


      {/* Message Content */}
      <div style={{ maxWidth: "75%" }}>
        {/* Sender Name */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#555",
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
            padding: "1px",
            color: "#000",
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


