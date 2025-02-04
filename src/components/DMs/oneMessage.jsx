import React, { useState, useEffect } from "react";
import { MdOutlineReply } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";

const SingleMessage = ({ message, isCurrentUser, onReply, onReact }) => {
  const [hovered, setHovered] = useState(false);

  const iconContainer = (
    <div
      style={{
        flexDirection: "row",
        alignItems: "center",
        display: hovered ? "flex" : "none",
        marginLeft: isCurrentUser ? "10px" : "0px",
        marginRight: isCurrentUser ? "0px" : "10px",
      }}
    >
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#555",
          fontSize: "20px",
          padding: "0",
          margin: "2px",
        }}
        onClick={() => onReply(message)}
        title="Reply"
      >
        <MdOutlineReply />
      </button>
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#555",
          fontSize: "20px",
          padding: "0",
          margin: "1px",
        }}
        onClick={() => onReact(message)}
        title="React"
      >
        <MdOutlineEmojiEmotions />
      </button>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        margin: "10px 0",
      }}
      onMouseEnter={() => setHovered(true)} // Show icons on hover
      onMouseLeave={() => setHovered(false)} // Hide icons when not hovered
    >

      {isCurrentUser && iconContainer}
      
      <div
        style={{
          maxWidth: "70%",
          padding: "10px",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#E4E6EB",
          color: isCurrentUser ? "#fff" : "#000",
          borderRadius: "15px",
          borderTopLeftRadius: isCurrentUser ? "15px" : "0px",
          borderTopRightRadius: isCurrentUser ? "0px" : "15px",
          position: "relative",
        }}
      >
        {/* Reply Section */}
        {message.replyTo && (
          <div
            style={{
              fontStyle: "italic",
              color: isCurrentUser ? "#fff" : "#333",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            Reply to {message.replyTo.sender}: {message.replyTo.text}
          </div>
        )}

        {/* Message Content */}
        <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
          {message.text}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: "12px",
            marginTop: "5px",
            textAlign: "right",
            color: isCurrentUser ? "#fff" : "#555",
          }}
        >
          {message.timestamp}
        </div>
      </div>

      {/* If the message is from someone else, place icons on the right */}
      {!isCurrentUser && iconContainer}
    </div>
  );
};

export default SingleMessage;







