import React, { useState } from "react";
import ProfileEdit from "./Profile/EditProfile";

const myID = 24;

const ProfileCard = ({ username, id, userPic, bio, onFollowClick, isFollowing, onDMClick }) => {
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
        initialName={username}
        initialBio={bio}
        initialImage={userPic}
        initialPrivateProfile={false} // Update based on your data
        onSave={handleSaveChanges}
        onClose={handleClose}
      />
    );
  }

  return (
    <div style={profileCardStyle}>
      <img src={userPic} style={profilePicStyle} alt="User Profile" />
      <h2 style={usernameStyle}>{username}</h2>
      <h2 style={idStyle}>{id}</h2>
      <p style={bioStyle}>{bio}</p>
      {id !== myID ? (
        <div style={buttonContainerStyle}>
          <button onClick={onFollowClick} style={followButtonStyle}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <button onClick={onDMClick} style={dmButtonStyle}>
            Direct Message
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>  
          <button style={buttonEditStyle} >Edit Profile</button>
        </div>
      )}
    </div>
  );  
};

const bioStyle = {
  margin: "1px 0",
  color: "#333",
};

const profileCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
  textAlign: "center",
  width: "250px",
  fontFamily: "Arial, sans-serif",
};

const profilePicStyle = {
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  marginBottom: "15px",
  border: "1px solid #7CB9E8",
  objectFit: "cover",
};

const usernameStyle = {
  margin: "10px 0",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#333",
};

const idStyle = {
  margin: "2px 0",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#333",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "20px",
};

const buttonEditStyle = {
  justifyContent: "center",
  gap: "10px",
  marginTop: "20px",
  backgroundColor : "#7CB9E8",

};

const followButtonStyle = {
  flex: 1,
  padding: "10px 10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#7CB9E8",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
};

const dmButtonStyle = {
  flex: 1,
  padding: "10px 10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#6C757D",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
};

export default ProfileCard;