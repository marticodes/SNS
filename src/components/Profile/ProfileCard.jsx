import React, { useState } from "react";
import FollowingPopup from "./FollowList";
import ProfileEdit from "./EditProfile";

const ProfileCard = ({ username, id, userid, userPic, bio, followers, following, isMyProfile, isPrivate, onDMClick }) => {
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow/unfollow
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [foll, setFoll] = useState(2); // 2 for followers, 0 for following
  const [isEditing, setIsEditing] = useState(false);  //to come out the editing popup

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = (updatedData) => {
    console.log("Updated data:", updatedData);
    setIsEditing(false);
    // Update the profile data here if needed
  };

  if (isEditing) {
    return (
      <ProfileEdit
        userId={id}
        initialName={username}
        initialBio={bio}
        initialImage={userPic}
        initialPrivateProfile={isPrivate}
        onSave={handleSaveChanges}
        onClose={handleClose}
      />
    );
  }

  const togglePopup = (follType) => {
    setFoll(follType);
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
          <h2 style={idStyle}>{userid}</h2>
          <p style={bioStyle}>{bio}</p>
        </div>

      </div>

      <div style={statsContainerStyle}>
        <p style={statsStyle} onClick={() => togglePopup(2)}>
          <strong>{followers}</strong> Followers
        </p>
        <p style={statsStyle} onClick={() => togglePopup(3)}>
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

      {isMyProfile && (
        <button
          onClick={() => setIsEditing(true)}
          style={{ ...followButtonStyle, marginTop: "10px", backgroundColor: "#28a745" }}
        >
          Edit Profile
        </button>
      )}

      {isPopupVisible && (
        <FollowingPopup
          relation={foll}
          id = {id}
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
  border: "2px solid #7CB9E8",
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
  backgroundColor: "#7CB9E8",
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

export default ProfileCard;


