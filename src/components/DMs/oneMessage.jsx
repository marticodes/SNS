import React from "react";

const formatTimestamp = (timestamp) => {          //CHANGE THIS INTO WHAT TIMESTAMP IS ASKED BY BACKEND
  const date = new Date(timestamp);
  const options = {
    month: 'short', // Display month as a short name (e.g., Jan, Feb)
    day: '2-digit', // Display day as a 2-digit number (e.g., 21)
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  };
  return date.toLocaleString('en-US', options);
};

const SingleMessage = ({ message, isCurrentUser }) => {
  return (
    <div style={{ display: "flex", justifyContent: isCurrentUser ? "flex-end" : "flex-start", margin: "10px 0" }}>
      <div
        style={{
          maxWidth: "60%",
          padding: "10px",
          borderRadius: "20px",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#f0f0f0",
          color: isCurrentUser ? "#fff" : "#000",
        }}
      >
        {message.text}
        <div style={{ fontSize: "12px", marginTop: "5px", marginRight: "2px", textAlign: "right" }}>{message.timestamp}</div>  
      </div>
    </div>
  );
};
// CHANGE THIS INTO WHAT TIMESTAMP IS ASKED BY BACKEND


export default SingleMessage;
