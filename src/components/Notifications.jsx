import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { IoMdClose } from "react-icons/io";
import ProfileCard from "../components/PopUpProfileCard";

const notifications = [
  { id: 0, type: "reaction", user: "user_a", postId: 103, reactionType: "love", timestamp: "2025-02-06 10:15 AM" },
  { id: 1, type: "like", user: "user_x", postId: 101, timestamp: "2025-02-06 10:00 AM" },
  { id: 2, type: "comment", user: "user_y", postId: 102, timestamp: "2025-02-06 09:45 AM" },
  { id: 3, type: "follow", user: "user_z", timestamp: "2025-02-06 09:30 AM" },
  { id: 4, type: "request", user: "user_w", timestamp: "2025-02-06 09:15 AM" },
];

const caseNumb = 3; // Change this to test different cases

export default function NotificationPanel({ onClose }) {
  const navigate = useNavigate(); // Initialize navigate
  const [selectedUser, setSelectedUser] = useState(null);
  const profileCardRef = useRef(null); // Create a ref for ProfileCard

  // Close ProfileCard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setSelectedUser(null); // Close ProfileCard when click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDMClick = () => {
    navigate("/dms", { state: { chatUser: "Kim Seokjin" } });
  };

  const handleUserClick = (user) => {
    if (caseNumb === 1 || caseNumb === 2) {
      navigate(`/user`); // Navigate to user profile page
    } else if (caseNumb === 3 || caseNumb === 4) {
      setSelectedUser(user); // Update state to show ProfileCard
    }
  };

  const handleCloseProfileCard = () => {
    setSelectedUser(null); // Close ProfileCard
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navigate to post page
  };

  const renderNotification = (notification) => {
    switch (notification.type) {
      case "reaction":
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> reacted to your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case "like":
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> liked your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case "comment":
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> commented on your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case "follow":
        return (
          <div style={notificationItemStyle}>
            <div style={{ cursor: "pointer" }} onClick={() => handleUserClick(notification.user)}>
              <p style={textStyle}>
                <strong>{notification.user}</strong> started following you.
              </p>
              <p style={timestampStyle}>{notification.timestamp}</p>
            </div>
            <button style={followButtonStyle}>Follow</button>
          </div>
        );
      case "request":
        return (
          <div style={notificationItemStyle}>
            <div style={{ cursor: "pointer" }} onClick={() => handleUserClick(notification.user)}>
              <p style={textStyle}>
                <strong>{notification.user}</strong> requested to follow you.
              </p>
              <p style={timestampStyle}>{notification.timestamp}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ ...actionButtonStyle, backgroundColor: "green" }}>Accept</button>
              <button style={{ ...actionButtonStyle, backgroundColor: "red" }}>Decline</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const panelStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "320px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    overflowY: "auto",
    borderLeft: "1px solid #e0e0e0",
  };

  const buttonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const followButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#7CB9E8",
    padding: "5px 15px",
    fontSize: "12px",
  };

  const actionButtonStyle = {
    ...buttonStyle,
    padding: "5px 10px",
    fontSize: "12px",
  };

  const headerStyle = {
    padding: "15px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  };

  const cardStyle = {
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#fefefe",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const notificationItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  };

  const textStyle = {
    color: "#262626",
    fontSize: "14px",
  };

  const timestampStyle = {
    color: "#9e9e9e",
    fontSize: "10px",
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: "16px", color: "#262626" }}>Notifications</h2>
        <IoMdClose style={{ fontSize: "20px", color: "black" }} onClick={onClose} />
      </div>

      <div>
        {notifications.map((notification) => (
          <div key={notification.id} style={cardStyle}>
            {renderNotification(notification)}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div
          ref={profileCardRef} // Assign ref to ProfileCard container
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <ProfileCard
            id={1}
            username={selectedUser}
            userid="@janedoe"
            userPic={"profile_picture_url"}
            bio="Photographer & Nature Lover"
            onDMClick={handleDMClick}
            relationship={"follower"}
            isMyProfile={false}
            onClose={handleCloseProfileCard} // Close button callback
          />
        </div>
      )}
    </div>
  );
}