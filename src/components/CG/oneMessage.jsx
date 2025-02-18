import React, { useState, useRef, useEffect } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import ProfileCard from "../PopUpProfileCard";

const formatTimestamp = (timestamp) => {
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
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ x: 0, y: 0 });
  const profileCardRef = useRef(null); // Ref for the profile card
  const timeoutRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setReaction(emoji.emoji);
    if (onReact) onReact(message, emoji.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker((prev) => !prev);
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    if (onReply) onReply(message);
  };

  const handleNameClick = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setProfilePosition({ x: rect.right + 10, y: rect.top });
    setShowProfileCard((prev) => !prev);
  };

  // Detect click outside the profile card to hide it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const iconContainer = (
    <div
      style={{
        display: hovered ? "flex" : "none",
        flexDirection: "row",
        alignItems: "center",
        gap: "5px",
        position: "absolute",
        top: "1px",
        right: "-50px",
        zIndex: 1000,
        marginLeft: "15px",
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
              left: "-150px",
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

      <div style={{ maxWidth: "75%" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#555",
            marginBottom: "3px",
            cursor: "pointer",
          }}
          onClick={handleNameClick}
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

        {showProfileCard && (
          <div
            ref={profileCardRef} // Attach ref to profile card container
            style={{
              position: "absolute",
              top: profilePosition.y,
              left: profilePosition.x,
              zIndex: 1000,
            }}
          >
            <ProfileCard
              username={message.sender}
              id={24}
              userPic={`https://i.pravatar.cc/120?u=${message.sender}`}
              bio = {`This is the bio of ${message.sender}`}
              onFollowClick={() => alert("Follow button clicked")}     //CHANGE
              isFollowing={false}
              onDMClick={() => alert("DM button clicked")}     //CHANGE
            />
          </div>
        )}

        <div
          onMouseEnter={() => {
            clearTimeout(timeoutRef.current);
            setHovered(true);
          }}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(() => {
              setHovered(false);
              setShowEmojiPicker(false);
            }, 300);
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




