import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { IoMdClose } from "react-icons/io";
import ProfileCard from "../components/PopUpProfileCard";
import { use } from "react";

const userId = localStorage.getItem("userID");
const caseNumb = parseInt(localStorage.getItem("selectedCase"), 10);

export default function NotificationPanel({ onClose }) {
  const navigate = useNavigate(); 
  const [selectedUser, setSelectedUser] = useState(null);
  const profileCardRef = useRef(null); 
  const [buttonStates, setButtonStates] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/notifs/id/${userId}`);
        const data = await response.json();

        const mappedNotifications = data.map((notif) => ({
          notif_type: notif.notif_type,
          user: `user_${notif.sender_id}`,
          postId: notif.postId || null,
          timestamp: notif.timestamp,
          id: notif.notif_id,
          myUserId: userId,
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  console.log(notifications);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDMClick = () => {
    navigate("/dms", { state: { chatUser: "Kim Seokjin" } });
  };

  const handleUserClick = (user) => {
    if (caseNumb === 1 || caseNumb === 2) {
      navigate(`/user`); // Navigate to user profile page
    } else if (caseNumb === 3 || caseNumb === 4) {
      setSelectedUser(user); // Update state to show ProfileCard
    }
  };

  const handleCloseProfileCard = () => {
    setSelectedUser(null); // Close ProfileCard
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navigate to post page
  };

  const handleFollowClick = async (isPrivate, myUserId, id) => {
    console.log("Follow button clicked");
    console.log("myUserId:", myUserId, "id:", id);
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

      setButtonStates((prevState) => ({
        ...prevState,
        [`follow-${id}`]: "Requested",
  
      }));

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

      setButtonStates((prevState) => ({
        ...prevState,
        [`follow-${id}`]: "Following",
  
      }));
    }
  };

  const handleAcceptClick = async (id, myUserId) => {
    console.log("Accept button clicked");
    await fetch("http://localhost:3001/api/requests/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id_1: id, user_id_2: myUserId }),
    });

    await fetch("http://localhost:3001/api/relations/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relation_type: 2, user_id_1: id, user_id_2: myUserId }),
    });

    const notifIdResponse = await fetch(`http://localhost:3001/api/notifs/${myUserId}/4/${id}`);
    const notifid = await notifIdResponse.json();

    await fetch(`http://localhost:3001/api/notifs/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notif_id: notifid}),
    });

    setButtonStates((prevState) => ({
      ...prevState,
      [`request-${id}`]: "Accepted",
    }));

  };

  const handleDeclineClick = async (id, myUserId) => {
    console.log("Decline button clicked");
    await fetch("http://localhost:3001/api/requests/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id_1: id, user_id_2: myUserId }),
    });
  
    const notifIdResponse = await fetch(`http://localhost:3001/api/notifs/${myUserId}/4/${id}`);
          const notifid = await notifIdResponse.json();

    await fetch(`http://localhost:3001/api/notifs/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notif_id: notifid }), 
    });
    setButtonStates((prevState) => ({
      ...prevState,
      [`request-${id}`]: "Declined",
    }));
  
  };

  const panelStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: "320px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 100000,
    overflowY: "auto",
    borderLeft: "1px solid #e0e0e0",
  };

  const buttonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const followButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#7CB9E8",
    padding: "5px 15px",
    fontSize: "12px",
  };

  const actionButtonStyle = {
    ...buttonStyle,
    padding: "5px 10px",
    fontSize: "12px",
  };

  const headerStyle = {
    padding: "15px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  };

  const cardStyle = {
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#fefefe",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const notificationItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  };

  const textStyle = {
    color: "#262626",
    fontSize: "14px",
  };

  const timestampStyle = {
    color: "#9e9e9e",
    fontSize: "10px",
  };
  

  const renderNotification = (notification) => {

    const followLabel = buttonStates[`follow-${notification.id}`] || "Follow";
    const requestLabel = buttonStates[`request-${notification.id}`] || null;

    switch (notification.notif_type) {
      case 0:
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> reacted to your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case 1:
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> liked your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case 2:
        return (
          <div style={{ cursor: "pointer" }} onClick={() => handlePostClick(notification.postId)}>
            <p style={textStyle}>
              <strong>{notification.user}</strong> commented on your post.
            </p>
            <p style={timestampStyle}>{notification.timestamp}</p>
          </div>
        );
      case 3:
        return (
          <div style={notificationItemStyle}>
            <div style={{ cursor: "pointer" }} onClick={() => handleUserClick(notification.user)}>
              <p style={textStyle}>
                <strong>{notification.user}</strong> started following you.
              </p>
              <p style={timestampStyle}>{notification.timestamp}</p>
            </div>
            <button
              style={followButtonStyle}
              onClick={() => handleFollowClick(notification.isPrivate, notification.myUserId, notification.id)}
            >
              {followLabel}
            </button>
          </div>
        );
      case 4:
        return (
          <div style={notificationItemStyle}>
            <div style={{ cursor: "pointer" }} onClick={() => handleUserClick(notification.user)}>
              <p style={textStyle}>
                <strong>{notification.user}</strong> requested to follow you.
              </p>
              <p style={timestampStyle}>{notification.timestamp}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ ...actionButtonStyle, backgroundColor: "green" }}
                onClick={() => handleAcceptClick(notification.id, notification.myUserId)}>
                {requestLabel === "Accepted" ? "Accepted" : "Accept"} 
              </button>
              <button
                style={{ ...actionButtonStyle, backgroundColor: "red" }}
                onClick={() => handleDeclineClick(notification.id, notification.myUserId)}>
                {requestLabel === "Declined" ? "Declined" : "Decline"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: "16px", color: "#262626" }}>Notifications</h2>
        <IoMdClose style={{ fontSize: "20px", color: "black" }} onClick={onClose} />
      </div>

      <div>
        {notifications.map((notification) => (
          <div key={notification.id} style={cardStyle}>
            {renderNotification(notification)}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div
          ref={profileCardRef} // Assign ref to ProfileCard container
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <ProfileCard
            id={1}
            username={selectedUser}
            userid="@janedoe"
            userPic={"profile_picture_url"}
            bio="Photographer & Nature Lover"
            onDMClick={handleDMClick}
            relationship={"follower"}
            isMyProfile={false}
            onClose={handleCloseProfileCard} // Close button callback
          />
        </div>
      )}
    </div>
  );
}