import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [isFollowing, setIsFollowing] = useState(false); // State for the Follow button
  const navigate = useNavigate(); // React Router navigation hook

  // Handle Follow/Unfollow
  const handleFollowClick = () => {
    setIsFollowing((prevState) => !prevState);
  };

  // Handle Direct Message
  const handleDMClick = () => {
    // CHANHE THIS TO THE CORRECT USER
    navigate("/chat", { state: { chatUser: "Kim Namjoon" } });  
  };

  return (
    <div style={pageStyle}>
      <div style={profileCardStyle}>
        {/* User Profile Info */}
        <img
          src="https://via.placeholder.com/100" // Replace with a real profile picture URL
          alt="User Profile"
          style={profilePicStyle}
        />
        <h2 style={usernameStyle}>Kim Namjoon</h2> {/* Replace with the user's name */}
        {/* Buttons */}
        <div style={buttonContainerStyle}>
          <button onClick={handleFollowClick} style={followButtonStyle}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <button onClick={handleDMClick} style={dmButtonStyle}>
            Direct Message
          </button>
        </div>
      </div>
    </div>
  );
};

// Styling
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f4f4f9",
};

const profileCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "300px",
};

const profilePicStyle = {
  borderRadius: "50%",
  width: "100px",
  height: "100px",
  marginBottom: "10px",
};

const usernameStyle = {
  fontSize: "24px",
  margin: "10px 0",
  color: "#333",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
};

const followButtonStyle = {
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

const dmButtonStyle = {
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default UserPage;

