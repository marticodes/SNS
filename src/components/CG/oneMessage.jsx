import React, { useState, useRef, useEffect } from "react";
import { MdOutlineReply, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import ProfileCard from "../PopUpProfileCard";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for month
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero for hours
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero for minutes

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const SingleMessage = ({ message, onReply, scrollToMessage }) => {
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ x: 0, y: 0 });
  const [userData, setUserData] = useState(null);
  const [emojiReactions, setEmojiReactions] = useState([]);
  const profileCardRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentUserID = parseInt(localStorage.getItem("userID"), 10);
  
    useEffect(() => {
      const fetchReactions = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/reactions/posts/${message.post_id}` 
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
        const response = await fetch("http://localhost:3001/api/reactions/post/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reaction_type: 4,
            emote_type: emoji.emoji,
            post_id: message.post_id,
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

    const computeTimeLeft = () => {
      if (message.timestamp && message.duration) {
        const postTimestamp = new Date(message.timestamp);
        const currentTime = new Date();
        const timeRemaining =
          postTimestamp.getTime() +
          message.duration * 24 * 60 * 60 * 1000 -
          currentTime.getTime();
  
        if (timeRemaining > 0) {
          const hoursLeft = Math.floor(timeRemaining / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          if (hoursLeft > 0) {
            return `${hoursLeft} hours left`;
          } else if (minutesLeft > 0) {
            return `${minutesLeft} minutes left`;
          }
        }
      }
      return null;
    };
  
    const timeLeft = computeTimeLeft();

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
        const response = await fetch(`http://localhost:3001/api/user/${message.user_id}`);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (message.user_id) {
      fetchUserInfo();
    }
  }, [message.user_id]);

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
        margin: "15px 5px",
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
          src={userData?.profile_picture || "default-avatar.png"}
          alt="User Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onClick={handleNameClick}
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
              color: "#007bff",
              marginLeft: "5px",
            }}
          >
            {formatTimestamp(message.timestamp)}
            {timeLeft && ` • ${timeLeft}`}
          </span>
        </div>

        {showProfileCard && (
          <div
            ref={profileCardRef}
            style={{
              position: "absolute",
              top: profilePosition.y,
              left: profilePosition.x,
              zIndex: 1000,
            }}
          >
            <ProfileCard
              username={userData.user_name}
              id={message.user_id}
              userPic={userData.profile_picture}
              bio={userData.user_bio}
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
            fontSize: "13px",
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
              onClick={() => scrollToMessage(message.replyTo.post_id)}
            >
              Reply to {message.replyTo.sender}: {message.replyTo.text}
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

export default SingleMessage;