import React, { useState } from "react";
import { MdOutlineAddComment } from "react-icons/md";
import NewChat from "../newChat"; // Import the component properly

let globalCaseType = 1; // Global variable for caseType

const UserList = ({ users, onUserClick, ProfilePics }) => {
  const [userList, setUserList] = useState(users);
  const [showNewChat, setShowNewChat] = useState(false); // State to control visibility of the newChat component

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
    setShowNewChat(true); // Show the newChat component
  };

  const handleCloseNewChat = () => {
    setShowNewChat(false); // Hide the newChat component
  };

  const handleUserListUpdate = (newChat) => {
    setUserList((prevList) => [...prevList, newChat]); // Add the new chat to the list
  };

  return (
    <div
      style={{
        height: "100vh", // Ensures the sidebar stretches to full page height
        backgroundColor: "#ffffff",
        color: "#fff",
        padding: "10px",
        overflowY: "auto", // Allows scrolling if there are too many users
        borderRight: "0.1px solid #B0BEC5",
        position: "relative", // Required for stacking NewChat box
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#032F50",
          textAlign: "center",
          paddingBottom: "10px",
          borderBottom: "0.1px solid #B0BEC5",
          display: "flex", // Using flex to align items horizontally
          justifyContent: "center", // Center the content
          alignItems: "center", // Vertically align items
        }}
      >
        Messages
        <span
          style={{
            marginLeft: "80px", // Space between the text and icon
            marginTop: "5px", // Center the icon vertically
            marginBottom: "-5px", // Center the icon vertically
            cursor: "pointer", // Make it clickable
          }}
          onClick={handleOpenNewChat} // Call the handler
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
        {userList.map((user, index) => (
          <li
            key={index}
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
            onClick={() => onUserClick(user)} // Call the function when the user is clicked
          >
            {/* Display user profile picture */}
            <img
              src={ProfilePics[user] || "https://via.placeholder.com/30"} // Use the dummy image URL based on user name
              alt={user}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

/* Styles for modal */
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
    position: "relative", // Needed for positioning the close button
  },
};