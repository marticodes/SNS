import React from "react";
import { MdOutlineReply } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";

const SingleMessage = ({ message, isCurrentUser, onReply, onReact }) => {
  const emojiReactions = ['😀', '😍', '😂', '😢', '😡', '👍', '👏'];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        margin: "10px 0",
        position: "relative",
      }}
    >
      {/* Message Bubble */}
      <div
        style={{
          maxWidth: "70%",
          padding: "10px",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#E4E6EB",
          color: isCurrentUser ? "#fff" : "#000",
          borderRadius: "15px",
          borderTopLeftRadius: isCurrentUser ? "15px" : "0px",
          borderTopRightRadius: isCurrentUser ? "0px" : "15px",
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
        <div style={{ fontSize: "16px", lineHeight: "1.5" }}>{message.text}</div>

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

      {/* Always-Visible Action Icons */}
      <div
        style={{
          display: "flex",
          flexDirection: "row", // Align horizontally
          alignItems: "center",
          justifyContent: isCurrentUser ? "flex-start" : "flex-end",
          marginLeft: isCurrentUser ? "10px" : "0px",
          marginRight: isCurrentUser ? "0px" : "10px",
        }}
      >
        {/* Reply Icon */}
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
        {/* Reaction Icon */}
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
    </div>
  );
};

export default SingleMessage;






