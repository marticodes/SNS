import React, { useState, useEffect, useRef } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import ProfileCard from "../PopUpProfileCard";

const GroupMessage = ({ message, isCurrentUser, onReply, onReact }) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [userInfo, setUserInfo] = useState({ user_name: "", profile_picture: "" });
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ x: 0, y: 0 });
  const profileCardRef = useRef(null);

  const handleEmojiClick = (emoji) => {
      setReaction(emoji.emoji); 
      onReact(message, emoji.emoji); 
      setShowEmojiPicker(false);
    };
  
    const toggleEmojiPicker = () => {
      setShowEmojiPicker((prev) => !prev);
    };

    const handleNameClick = (e) => {
      e.stopPropagation();
      const rect = e.target.getBoundingClientRect();
      setProfilePosition({ x: rect.right + 10, y: rect.top - 20 });
      setShowProfileCard((prev) => !prev);
    };
  
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

    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/user/${message.sender}`);
          if (response.ok) {
            const data = await response.json();
            setUserInfo({
              user_name: data.user_name,
              profile_picture: data.profile_picture,
            });
          } else {
            console.error("Failed to fetch user info.");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
  
      fetchUserInfo();
    }, [message.sender]);
  
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
        gap: "10px",
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
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: isCurrentUser ? "#7CB9E8" : "#E4E6EB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: isCurrentUser ? "#fff" : "#000",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        <img src={userInfo
          ? userInfo.profile_picture
          : "https://www.gravatar.com/avatar/?d=identicon"} 
          alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%" }} 
          onClick={handleNameClick}
          />  

      </div>

      {/* Message Content */}
      <div style={{ maxWidth: "75%" }}>
        
        {/* Sender Name */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: isCurrentUser ? "#7CB9E8" : "#555",
            marginBottom: "3px",
          }}
          onClick={handleNameClick}
        >
          {userInfo.user_name}{" "}
          <span style={{ fontSize: "12px", color: "#999", marginLeft: "5px" }}>
            {message.timestamp}
          </span>
        </div>
        {!isCurrentUser && iconContainer}

        {showProfileCard && (
          <div
            ref={profileCardRef}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 1000,
            }}
          >

          <ProfileCard
            username={userInfo.user_name}
            id={message.sender}
            userPic={userInfo.profile_picture}
            bio={userInfo.user_bio}
            onDMClick={() => alert("DM button clicked")}
          />
        </div>

)}
        
        {/* Message Bubble */}
        <div
          style={{
            padding: "10px",
            backgroundColor: isCurrentUser ? "#D1E7FF" : "#F2F3F5",
            color: isCurrentUser ? "#000" : "#000",
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
              borderLeft: !isCurrentUser ? "2px solid rgb(93, 104, 115)" : "2px solid #7CB9E8",
              paddingLeft: "8px",
            }}
            onClick={() => scrollToMessage(message.replyTo.post_id)}
          >
            Reply to: {replyMessage}
          </div>
        )}
          {message.text}
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
        </div>
      </div>
    </div>
  );
};

export default GroupMessage;