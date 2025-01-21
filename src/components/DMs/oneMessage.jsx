import React from "react";

const SingleMessage = ({ message, isCurrentUser }) => {
  return (
    <div style={{ display: "flex", justifyContent: isCurrentUser ? "flex-end" : "flex-start", margin: "10px 0" }}>
      <div
        style={{
          maxWidth: "60%",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#f0f0f0",
          color: isCurrentUser ? "#fff" : "#000",
        }}
      >
        {message.text}
        <div style={{ fontSize: "12px", marginTop: "5px", textAlign: "right" }}>{message.timestamp}</div>
      </div>
    </div>
  );
};

export default SingleMessage;
