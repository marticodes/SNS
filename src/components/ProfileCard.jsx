import React from "react";

const ProfileCard = ({ username, userPic, followers, following, onFollowClick, isFollowing, onDMClick }) => {
  return (
    <div style={profileCardStyle}>
      {/* User Profile Info */}
      <img
        src={userPic} // Use the dynamic userPic prop
        alt={`${username}'s Profile`}
        style={profilePicStyle}
      />
      <h2 style={usernameStyle}>{username}</h2> {/* Display the user's name */}
      
      {/* Followers and Following Count */}
      <div style={statsContainerStyle}>
        <p style={statsStyle}>
          <strong>{followers}</strong> Followers
        </p>
        <p style={statsStyle}>
          <strong>{following}</strong> Following
        </p>
      </div>

      {/* Buttons */}
      <div style={buttonContainerStyle}>
        <button onClick={onFollowClick} style={followButtonStyle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button onClick={onDMClick} style={dmButtonStyle}>
          Direct Message
        </button>
      </div>
    </div>
  );
};

// Styles remain the same as before
const profileCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "300px",
};

const profilePicStyle = {
  borderRadius: "10%",
  width: "100px",
  height: "100px",
  marginBottom: "10px",
  border: "1px solid #333",
};

const usernameStyle = {
  margin: "10px 0",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#000",
};

const statsContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  margin: "15px 0",
};

const statsStyle = {
  margin: "0",
  fontSize: "16px",
  color: "#000",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const followButtonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#007BFF",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

const dmButtonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#6C757D",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

export default ProfileCard;
