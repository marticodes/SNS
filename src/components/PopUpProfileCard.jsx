import React, { useState, useEffect } from "react";
import ProfileEdit from "./Profile/EditProfile";

const myID = parseInt(localStorage.getItem("userID"), 10);

const ProfileCard = ({ idname, username, id, userPic, bio, onDMClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [relationship, setRelationship] = useState("Loading...");

  useEffect(() => {
    const fetchRelationship = async () => {
      const status = await getRelationshipStatus(myID, id);
      setRelationship(status);
    };

    if (id !== myID) {
      fetchRelationship();
    }
  }, [id]);

  const getRelationshipStatus = async (myID, targetUserId) => {
    try {
      console.log("myID:", myID);
      console.log("targetUserId:", targetUserId);
      // Case 1: Check if I follow them
      let response = await fetch(`http://localhost:3001/api/relations/${myID}/${targetUserId}`);
      let data = await response.json();
      if (response.ok && data && data.relation_type === 2) {
        return "Unfriend";
      }    
  
      // Case 2: Check if I requested them
      response = await fetch(`http://localhost:3001/api/requests/${targetUserId}`);
      data = await response.json();
      console.log("Data:", data);
      if (response.ok && Array.isArray(data) && data.some(item => String(item) === String(myID))) {
        return "Requested";
      }

      return "Add Friend";
  
    } catch (error) {
      console.error("Error fetching relationship status:", error);
      return "Add Friend"; 
    }
  };

  const handleClick = async () => {
    try {
      const timestamp = new Date().toISOString();

      switch (relationship) {
        case "Requested":
          await fetch("http://localhost:3001/api/requests/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id_1: myID, user_id_2: id }),
          });

          const notifIdResponse = await fetch(`http://localhost:3001/api/notifs/${myID}/4/${id}`);
          const notifid = await notifIdResponse.json();

          await fetch(`http://localhost:3001/api/notifs/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notif_id: notifid }), 
          });
          setRelationship("Add Friend");
          break;
        
        case "Add Friend":
            await fetch("http://localhost:3001/api/requests/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id_1: myID, user_id_2: id }),
            });

            await fetch("http://localhost:3001/api/notifs/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notif_type: 4, sender_id: myID, receiver_id: id, timestamp: timestamp }),
            });
          setRelationship("Requested");
          break;

        default: // "Unfriend"
          await fetch("http://localhost:3001/api/relations/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id_1: myID, user_id_2: id }),
          });
          
          setRelationship("Add Friend");
          break;
      }
    } catch (error) {
      console.error("Error in handleFollowClick:", error);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = (updatedData) => {
    console.log("Updated data:", updatedData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ProfileEdit
        initialName={username}
        initialBio={bio}
        initialImage={userPic}
        initialPrivateProfile={false}
        onSave={handleSaveChanges}
        onClose={handleClose}
      />
    );
  }

  return (
    <div style={profileCardStyle}>
      <img src={userPic} style={profilePicStyle} alt="User Profile" />
      <h2 style={usernameStyle}>{username}</h2>
      <h2 style={idStyle}>{idname}</h2>
      <p style={bioStyle}>{bio}</p>
      {id !== myID ? (
        <div style={buttonContainerStyle}>
          <button onClick={handleClick} style={followButtonStyle}>
            {relationship}
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
  width: "60px",
  height: "60px",
  border: "1px solid #7CB9E8",
  objectFit: "cover",
};

const usernameStyle = {
  margin: "1px 0",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#333",
};

const idStyle = {
  margin: "1px 0",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#333",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "10px",
};

const buttonEditStyle = {
  justifyContent: "center",
  gap: "10px",
  marginTop: "10px",
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