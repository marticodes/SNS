import React, { useState } from "react";
import { MdOutlineAddComment } from "react-icons/md";
import NewChat from "./newChat"; // Import the component properly

let globalCaseType = 1; // Global variable for caseType

const UserList = ({ users, onUserClick, ProfilePics }) => {
  const [showNewChat, setShowNewChat] = useState(false); // State to control visibility of the newChat component

  const handleOpenNewChat = () => {
    globalCaseType = 2; // Update the global caseType
    setShowNewChat(true); // Show the newChat component
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

      {/* Conditionally render the newChat component */}
      {showNewChat ? (
        <NewChat caseType={globalCaseType} followers={users} />
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {users.map((user, index) => (
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
      )}
    </div>
  );
};

export default UserList;



