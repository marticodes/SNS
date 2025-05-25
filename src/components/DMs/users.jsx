import React, { useState, useEffect } from "react";
import { MdOutlineAddComment, MdGroups2 } from "react-icons/md";
import NewChat from "../newChat";

let globalCaseType = parseInt(localStorage.getItem("selectedCase"), 10);
let userId = parseInt(localStorage.getItem("userID"), 10);

const UserList = ({ users, onUserClick}) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({}); // Stores unread counts per chat

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chats/unread/all/${userId}`);
        const data = await response.json();

        const counts = data.reduce((acc, chatId) => {
          acc[chatId] = (acc[chatId] || 0) + 1;
          return acc;
        }, {});

        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadCounts();
  }, [userId]);

  const handleChatClick = async (chat) => {
    onUserClick(chat);

    if (unreadCounts[chat.chat_id]) {
      // Mark messages as read
      try {
        await fetch("http://localhost:3001/api/read/receipts/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat.chat_id, user_id: userId }),
        });

        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [chat.chat_id]: 0, 
        }));
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleOpenNewChat = () => {
    setShowNewChat(true);
  };

  const handleCloseNewChat = () => {
    setShowNewChat(false); 
  };

  return (
    <div
      style={{
        height: "100vh", 
        backgroundColor: "#ffffff",
        color: "#fff",
        padding: "10px",
        overflowY: "auto", 
        borderRight: "0.1px solid #B0BEC5",
        position: "relative",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#032F50",
          textAlign: "center",
          paddingBottom: "10px",
          borderBottom: "0.1px solid #B0BEC5",
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Messages
        <span
          style={{
            marginLeft: "80px", 
            marginTop: "5px",
            marginBottom: "-3px", 
            cursor: "pointer", 
          }}
          onClick={handleOpenNewChat} 
        >
          <MdOutlineAddComment size={20} />
        </span>
      </h2>

      {showNewChat && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContainer}>
            <NewChat
              caseType={globalCaseType}
              closeModal={handleCloseNewChat}
            />
          </div>
        </div>
      )}

      {/* Render the user list */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {users.map((chat) => (
          <li
            key={chat.chat_id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "#F4FAFF",
              margin: "5px 0",
              borderRadius: "3px",
              color: "#000000",
              textAlign: "left",
              fontSize: "13px"
            }}
            onClick={() => handleChatClick(chat)} // Call the function when the user is clicked
          >
            {/* Display user profile picture */}
            {chat.image ? (
              <img
                src={chat.image}
                alt="Chat"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            ) : (
              <MdGroups2
              size={30}
              style={{
                  width: "25px",     
                  height: "25px",   
                  color: "#032F50",
                  marginLeft: "5px",
                  marginRight: "10px",
                  flexShrink: 0      
                }}
              />
            )}
            {chat.name}
            {unreadCounts[chat.chat_id] > 0 && (
              <span style={{ marginLeft: "auto", backgroundColor: "red", color: "white", borderRadius: "80%", padding: "3px 7px", fontSize: "10px" }}>
                {unreadCounts[chat.chat_id]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;


const styles = {
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // On top of other elements
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    position: "relative",
  },
};