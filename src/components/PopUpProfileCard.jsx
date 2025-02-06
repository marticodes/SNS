import React from "react";

const ProfileCard = ({ username, userPic, bio, onFollowClick, isFollowing, onDMClick }) => {

  const handleFollowClick = () => {
    setIsFollowing((prevState) => !prevState);
  };

  // Handle Direct Message
  const handleDMClick = () => {
    navigate("/chat", { state: { chatUser: {username} } });
  };

  return (
    <div style={profileCardStyle}>
      <img
        src={userPic}
        alt={`${username}'s Profile`}
        style={profilePicStyle}
      />
      <h2 style={usernameStyle}>{username}</h2>
      <p>{bio}</p>
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