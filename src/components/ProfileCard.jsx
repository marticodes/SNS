import React, { useState } from "react";
import FollowingPopup from "./FollowList"; // Assuming the component is in the same folder

const ProfileCard = ({ username, id, userPic, bio, followers, following, onDMClick }) => {
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow/unfollow
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [foll, setFoll] = useState(1); // 1 for followers, 0 for following
  
  const users = [
    {
      id: 1,
      username: "pharrell",
      fullname: "SON OF A PHARAOH",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      username: "keithharingfoundation",
      fullname: "Keith Haring Foundation",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  const togglePopup = (follType) => {
    setFoll(follType); // 1 for followers, 0 for following
    setPopupVisible(true); // Open popup
  };

  // Function to handle follow/unfollow
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing); // Toggle isFollowing state
  };

  return (
    <div style={profileCardStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={userPic}
          alt={`${username}'s Profile`}
          style={{ ...profilePicStyle, marginRight: "20px", marginLeft: "30px" }}
        />
        <div>
          <h2 style={usernameStyle}>{username}</h2>
          <h2 style={idStyle}>{id}</h2>
          <p style={bioStyle}>{bio}</p>
        </div>
      </div>

      <div style={statsContainerStyle}>
        <p style={statsStyle} onClick={() => togglePopup(1)}>
          <strong>{followers}</strong> Followers
        </p>
        <p style={statsStyle} onClick={() => togglePopup(0)}>
          <strong>{following}</strong> Following
        </p>
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={handleFollowClick} style={followButtonStyle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button onClick={onDMClick} style={dmButtonStyle}>
          Direct Message
        </button>
      </div>

      {isPopupVisible && (
        <FollowingPopup
          foll={foll}
          users={users}
          onClose={() => setPopupVisible(false)}
        />
      )}
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
  width: "90px",
  height: "90px",
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

const idStyle = {
  marginTop: "-10px",
  fontSize: "12px",
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
  cursor: "pointer", // Makes it look clickable
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


