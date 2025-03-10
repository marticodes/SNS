import React, { useState, useEffect } from "react";
import { MdOutlineAddComment, MdGroups2 } from "react-icons/md";
import NewChat from "../newChat";

let globalCaseType = parseInt(localStorage.getItem("selectedCase"), 10);

const UserList = ({ users, onUserClick}) => {
  const [showNewChat, setShowNewChat] = useState(false);

  const userss = [
    { id: 1, name: "Alice Johnson", image: "https://via.placeholder.com/30" },
    { id: 2, name: "Bob Smith", image: "https://via.placeholder.com/30"},
    { id: 3, name: "Charlie Brown", image: "https://via.placeholder.com/30" },
    { id: 4, name: "Daisy Carter", image: "https://via.placeholder.com/30" },
    { id: 5, name: "Ethan Wright", image: "https://via.placeholder.com/30" },
    { id: 6, name: "Fiona Davis", image: "https://via.placeholder.com/30" },
    { id: 7, name: "George Miller", image: "https://via.placeholder.com/30" },
    { id: 8, name: "Hannah Wilson", image: "https://via.placeholder.com/30" },
    { id: 9, name: "Ian Clark", image: "https://via.placeholder.com/30" },
    { id: 10, name: "Jane Moore", image: "https://via.placeholder.com/30" },
  ];

  const handleOpenNewChat = () => {
    setShowNewChat(true);
  };

  const handleCloseNewChat = () => {
    setShowNewChat(false); 
  };

  const handleUserListUpdate = (newChat) => {
    setUserList((prevList) => [...prevList, newChat]); 
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
            marginBottom: "-5px", 
            cursor: "pointer", 
          }}
          onClick={handleOpenNewChat} 
        >
          <MdOutlineAddComment size={20} />
        </span>
      </h2>

      {/* Render the newChat modal */}
      {showNewChat && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContainer}>
            <NewChat
              caseType={globalCaseType}
              users={userss}
              closeModal={handleCloseNewChat}
              onUserListUpdate={handleUserListUpdate} // Pass the function to update the user list
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
            }}
            onClick={() => onUserClick(chat)} // Call the function when the user is clicked
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
                  marginRight: "10px",
                  color: "#032F50",
                }}
              />
            )}
            {chat.name}
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