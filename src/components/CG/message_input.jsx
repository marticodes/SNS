import React, { useState } from "react";

const MessageInput = ({ onSendMessage, replyTo, onCancelReply }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText(""); // Clear input after sending
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "10px", backgroundColor: "#fff" }}>
      {replyTo && (
        <div
          style={{
            marginBottom: "5px",
            backgroundColor: "#f7f7f7",
            padding: "10px",
            color: "#333",
            borderRadius: "5px",
            position: "relative",
          }}
        >
          <strong>Replying to:</strong> {replyTo.sender}: {replyTo.text}
          <button
            onClick={onCancelReply}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "transparent",
              border: "none",
              color: "#888",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>
      )}
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            color: "#000",
            marginRight: "10px",
            backgroundColor: "#fff",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "#7CB9E8",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

