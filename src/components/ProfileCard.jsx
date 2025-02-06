import React from "react";

const ProfileCard = ({ username, userPic, bio, followers, following, onFollowClick, isFollowing, onDMClick }) => {
  return (
    <div style={profileCardStyle}>
      <img
        src={userPic}
        alt={`${username}'s Profile`}
        style={profilePicStyle}
      />
      <h2 style={usernameStyle}>{username}</h2>
      <p style={bioStyle}>{bio}</p>
      
      <div style={statsContainerStyle}>
        <p style={statsStyle}>
          <strong>{followers}</strong> Followers
        </p>
        <p style={statsStyle}>
          <strong>{following}</strong> Following
        </p>
      </div>

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

const profileCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
  textAlign: "center",
  width: "320px",
  fontFamily: "Arial, sans-serif",
};

const profilePicStyle = {
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  marginBottom: "15px",
  border: "2px solid #007BFF",
  objectFit: "cover",
};

const usernameStyle = {
  margin: "10px 0",
  fontSize: "22px",
  fontWeight: "bold",
  color: "#333",
};

const bioStyle = {
  fontSize: "14px",
  color: "#555",
  margin: "10px 0",
};

const statsContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  margin: "20px 0",
};

const statsStyle = {
  margin: "0",
  fontSize: "16px",
  color: "#555",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "20px",
};

const followButtonStyle = {
  flex: 1,
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#007BFF",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  transition: "background-color 0.3s",
};

const dmButtonStyle = {
  flex: 1,
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#6C757D",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  transition: "background-color 0.3s",
};

followButtonStyle[":hover"] = { backgroundColor: "#0056b3" };
dmButtonStyle[":hover"] = { backgroundColor: "#5a6268" };

export default ProfileCard;


