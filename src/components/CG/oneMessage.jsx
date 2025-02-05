import React, { useState } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const formatTimestamp = (timestamp) => {
  // Format timestamp as "HH:MM" in 24-hour format
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const SingleMessage = ({ message, onReply, onReact }) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);

  const handleEmojiClick = (emoji) => {
    setReaction(emoji.emoji);
    if (onReact) {
      onReact(message, emoji.emoji);
    }
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowEmojiPicker((prev) => !prev);
  };

  const handleReplyClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onReply) {
      onReply(message);
    }
  };

  const iconContainer = (
    <div
      style={{
        display: hovered ? "flex" : "none",
        flexDirection: "row",
        alignItems: "center",
        gap: "5px",
        position: "absolute",
        top: "5px",
        right: "5px",
        zIndex: 1000,
      }}
    >
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#555",
          fontSize: "18px",
          padding: "0",
        }}
        onClick={handleReplyClick}
        title="Reply"
      >
        <MdOutlineReply />
      </button>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#555",
            fontSize: "18px",
            padding: "0",
          }}
          onClick={toggleEmojiPicker}
          title="React"
        >
          <MdOutlineEmojiEmotions />
        </button>
        {showEmojiPicker && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "-20px",
              zIndex: 1000,
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );

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
          backgroundColor: "#E4E6EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#000",
          fontWeight: "bold",
          fontSize: "14px",
          overflow: "hidden",
        }}
      >
        <img
          src={`https://i.pravatar.cc/40?u=${message.sender}`}
          alt="User Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
          <span
            style={{
              fontSize: "12px",
              color: "#999",
              marginLeft: "5px",
            }}
          >
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setShowEmojiPicker(false);
          }}
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
          {iconContainer}

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

          {reaction && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "20px",
                textAlign: "right",
                color: "#000",
              }}
            >
              {reaction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;


