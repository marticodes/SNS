import React, { useState, useEffect, useRef } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import ProfileCard from "../PopUpProfileCard";

const GroupMessage = ({ message, isCurrentUser, onReply, chatId }) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [userInfo, setUserInfo] = useState({ user_name: "", profile_picture: "" });
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ x: 0, y: 0 });
  const [emojiReactions, setEmojiReactions] = useState([]);
  const profileCardRef = useRef(null);

  const currentUserID = parseInt(localStorage.getItem("userID"), 10);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/reactions/messages/${chatId}/${message.id}`
        );
        if (response.ok) {
          const data = await response.json();

          const reactionsWithUserInfo = await Promise.all(
            data.emojiReactions.map(async (reaction) => {
              const users = await Promise.all(
                reaction.user_id.map(async (userId) => {
                  const userResponse = await fetch(`http://localhost:3001/api/user/${userId}`);
                  return userResponse.ok ? await userResponse.json() : null;
                })
              );
              return { ...reaction, users: users.filter((user) => user) };
            })
          );

          setEmojiReactions(reactionsWithUserInfo);
        } else {
          console.error("Failed to fetch reactions");
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [message.chat_id, message.message_id]);


  const handleEmojiClick = async (emoji) => {
    try {
      const response = await fetch("http://localhost:3001/api/reactions/message/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reaction_type: 4,
          emote_type: emoji.emoji,
          chat_id: chatId,
          message_id: message.id,
          user_id: currentUserID,
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (response.ok) {
        const newReaction = await response.json();
        setEmojiReactions((prev) => [...prev, { emote_type: emoji.emoji, users: [currentUserID] }]);
      } else {
        console.error("Failed to add reaction");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  
    setReaction(emoji.emoji);
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
        
        {/* Display Reactions */}
        {emojiReactions.length > 0 && (
          <div style={{ marginTop: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
            {emojiReactions.map((reaction) => (
              <div key={reaction.emote_type} style={{ display: "flex", alignItems: "center" }}>
                {/* Emoji */}
                <span style={{ fontSize: "20px" }}>{reaction.emote_type}</span>
                {/* User Profile Pictures */}
                <span style={{ fontSize: "14px", marginLeft: "5px", display: "flex", gap: "5px" }}>
                  {reaction.users.map((user) => (
                    <img
                      key={user.user_id}
                      src={user.profile_picture}
                      alt={`Profile picture of ${user.user_name}`}
                      title={user.user_name} // Tooltip with the user's name
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        cursor: "pointer", // Optional: indicates interactivity
                      }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default GroupMessage;