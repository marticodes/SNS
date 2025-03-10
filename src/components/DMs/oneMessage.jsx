import React, { useState, useEffect } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const SingleMessage = ({ message, isCurrentUser, onReply, onReact, scrollToMessage }) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);

  const handleEmojiClick = (emoji) => {
    setReaction(emoji.emoji); 
    onReact(message, emoji.emoji); 
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  useEffect(() => {
    const fetchReplyMessage = async () => {
      if (message.replyTo) {
        try {
          const response = await fetch(`http://localhost:3001/api/user/message/id/${message.replyTo}`);
          if (response.ok) {
            const data = await response.json();
            setReplyMessage(data.content);
          } else {
            console.error("Failed to fetch the reply message.");
          }
        } catch (error) {
          console.error("Error fetching reply message:", error);
        }
      }
    };

    fetchReplyMessage();
  }, [message.replyTo]);


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

      <div style={{ position: "relative", display: "inline-block" }}>
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
          onClick={toggleEmojiPicker}
          title="React"
        >
          <MdOutlineEmojiEmotions />
        </button>
        {showEmojiPicker && (
          <div
            style={{
              position: "absolute",
              top: "100%", // Position the picker directly below the button
              left: isCurrentUser ? "-300px" : "0px",
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
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        margin: "10px 0",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowEmojiPicker(false);
      }}
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
            color: isCurrentUser ? "#fff" : "#000",
            marginBottom: "5px",
            fontSize: "14px",
            borderLeft: isCurrentUser ? "2px solid rgb(255, 255, 255)" : "2px solid #7CB9E8",
            paddingLeft: "8px",
          }}
            onClick={() => scrollToMessage(message.replyTo.post_id)}
          >
            Reply to: {replyMessage}
          </div>
        )}

        {/* Message Content */}
        <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
          {message.text}
        </div>

        {/* Reaction */}
        {reaction && (
          <div
            style={{
              marginTop: "5px",
              fontSize: "20px",
              textAlign: "right",
              color: isCurrentUser ? "#fff" : "#000",
            }}
          >
            {reaction}
          </div>
        )}

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

      {!isCurrentUser && iconContainer}
    </div>
  );
};

export default SingleMessage;