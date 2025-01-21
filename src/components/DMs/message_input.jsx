import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <div style={{ display: "flex", padding: "10px", backgroundColor: "#fff" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #ccc", color: "#000", marginRight: "10px", backgroundColor: "#fff" }}
      />
      <button onClick={handleSend} style={{ padding: "10px 20px", borderRadius: "10px", backgroundColor: "#7CB9E8", color: "#fff", border: "none", cursor: "pointer" }}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
