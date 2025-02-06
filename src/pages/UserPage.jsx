import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard"; // Adjust the path as necessary
import NavBar from "../components/NavBar/Full";

const UserPage = () => {
  const [isFollowing, setIsFollowing] = useState(false); // State for the Follow button
  const [posts] = useState([
    { id: 1, content: "This is my first post!", date: "2025-01-01" },
    { id: 2, content: "Enjoying the weekend 🌟", date: "2025-01-15" },
    { id: 3, content: "Just finished reading a great book 📚", date: "2025-01-20" },
  ]); // Mock posts
  const navigate = useNavigate();

  // Handle Follow/Unfollow
  const handleFollowClick = () => {
    setIsFollowing((prevState) => !prevState);
  };

  // Handle Direct Message
  const handleDMClick = () => {
    navigate("/chat", { state: { chatUser: "Kim Namjoon" } });
  };

  return (
    <div style={pageStyle}>
      {/* Fixed NavBar */}
      <div style={navBarStyle}>
        <NavBar />
      </div>

      {/* Main content area */}
      <div style={contentStyle}>
        <div style={centerContentStyle}>
          {/* Profile Card */}
          <ProfileCard
            username="Kim Namjoon"
            userPic="https://via.placeholder.com/100" // Replace with a real profile picture URL
            bio = "Leader of BTS"
            followers={613}
            following={500}
            onFollowClick={handleFollowClick}
            isFollowing={isFollowing}
            onDMClick={handleDMClick}
          />

          {/* User's Posts */}
          <div style={feedContainerStyle}>
            <h3 style={feedTitleStyle}>Posts</h3>
            {posts.map((post) => (
              <div key={post.id} style={postStyle}>
                <p style={postContentStyle}>{post.content}</p>
                <p style={postDateStyle}>{post.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  display: "flex",
  height: "100vh", // Full height of the screen
  width: "100vw", // Full width of the screen
};

const navBarStyle = {
  position: "fixed", // Fix the NavBar to the side
  top: 0,
  left: 0,
  width: "180px", // 20% width for the navbar, this can be adjusted as needed
  height: "100%", // Full height of the screen
  backgroundColor: "#fff", // Optional background color for the NavBar
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Optional shadow for visual separation
};

const contentStyle = {
  marginLeft: "20%", // Leave space for the fixed NavBar
  padding: "20px",
  width: "80%", // Content takes the remaining 80% of the width
  overflowY: "auto", // Allow scrolling if the content overflows
  backgroundColor: "#fff",
};

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center content horizontally
  justifyContent: "flex-start", // Start from the top
  width: "100%",
  marginTop: "20px",
};

const feedContainerStyle = {
  width: "90%",
  maxWidth: "600px",
  marginTop: "20px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "15px",
};

const feedTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
  color: "#000",
};

const postStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const postContentStyle = {
  fontSize: "16px",
  color: "#000",
};

const postDateStyle = {
  fontSize: "12px",
  color: "#555",
  textAlign: "right",
  marginTop: "5px",
};

export default UserPage;

