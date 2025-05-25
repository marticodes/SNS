import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FollowingPopup from "./FollowList";
import ProfileEdit from "./EditProfile";

const ProfileCard = ({ username, id, userid, userPic, bio, followers, following, relationship, isMyProfile, isPrivate, updateRelationshipStatus}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [foll, setFoll] = useState(2); // 2 for followers, 0 for following
  const [isEditing, setIsEditing] = useState(false);
  const myUserId = localStorage.getItem("userID");
  const navigate = useNavigate();

  console.log("is prvate:", isPrivate);

  const handleClose = () => {
    setIsEditing(false);
  };

  const onDMClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/chats/exist/${myUserId}/${id}`);
      const data = await response.json();

      if (response.ok && data) {
        navigate(`/dms/${data}`);
      } else {
        const newChatResponse = await fetch("http://localhost:3001/api/chats/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id_1: myUserId, user_id_2: id, chat_name: null, chat_image: null }),
        });

        const newChatData = await newChatResponse.json();
        if (newChatResponse.ok && newChatData?.ina) {
          navigate(`/dms/${newChatData.ina}`);
        } else {
          console.error("Failed to create chat:", newChatData);
        }
      }
    } catch (error) {
      console.error("Error handling DM click:", error);
    }
  };

  const handleSaveChanges = (updatedData) => {
    console.log("Updated data:", updatedData);
    setIsEditing(false);
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
    setPopupVisible(true);
  };

  const handleClick = async () => {
    try {
      console.log("myUserId:", myUserId, "id:", id);
      const timestamp = new Date().toISOString();

      switch (relationship) {
        case "Requested":
          await fetch("http://localhost:3001/api/requests/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id_1: myUserId, user_id_2: id }),
          });

          const notifIdResponse = await fetch(`http://localhost:3001/api/notifs/${myUserId}/4/${id}`);
          const notifid = await notifIdResponse.json();

          await fetch(`http://localhost:3001/api/notifs/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notif_id: notifid }), 
          });

          window.location.reload();

          break;

        case "Follow Back":
        case "Follow":
          if (isPrivate === 1) {
            await fetch("http://localhost:3001/api/requests/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id_1: myUserId, user_id_2: id }),
            });

            await fetch("http://localhost:3001/api/notifs/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notif_type: 4, sender_id: myUserId, receiver_id: id, timestamp: timestamp }),
            });

          } else {
            await fetch("http://localhost:3001/api/relations/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ relation_type: 2, user_id_1: myUserId, user_id_2: id }),
            });

            await fetch("http://localhost:3001/api/notifs/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notif_type: 3, sender_id: myUserId, receiver_id: id, timestamp: timestamp}),
            });
          }
          window.location.reload();
          break;

        default: // "Unfollow"
          await fetch("http://localhost:3001/api/relations/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id_1: myUserId, user_id_2: id }),
          });

          window.location.reload();

          break;
      }
    } catch (error) {
      console.error("Error in handleFollowClick:", error);
    }
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
        <p style={statsStyle} onClick={() => togglePopup(0)}>
          <strong>{following}</strong> Following
        </p>
      </div>

      <div style={buttonContainerStyle}>
        {!isMyProfile && (
          <button onClick={handleClick} style={followButtonStyle}>
            {relationship}
          </button>
        )}
        {!isMyProfile && (
          <button onClick={onDMClick} style={dmButtonStyle}>
            Direct Message
          </button>
        )}
      </div>

      {isMyProfile && (
        <button
          onClick={() => setIsEditing(true)}
          style={{ ...followButtonStyle, marginTop: "10px", backgroundColor: "#28a745", fontSize: "14px" }}
        >
          Edit Profile
        </button>
      )}

      {isPopupVisible && (
        <FollowingPopup relation={foll} id={id} onClose={() => setPopupVisible(false)} />
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
  fontSize: "20px",
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
  fontSize: "14px",
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


