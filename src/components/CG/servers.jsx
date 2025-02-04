import React, { useState } from "react";

const UserList = ({ users, onUserClick, ProfilePics }) => {
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the clicked user as selected
    onUserClick(user); // Call the parent callback function
  };

  return (
    <div
      style={{
        width: "250px", // Match Sidebar width
        backgroundColor: "#fff",
        color: "#000",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        borderRight: "0.1px solid #ddd",
      }}
    >
      {/* Header */}
      <h4
        style={{
          padding: "15px",
          margin: "0",
          borderBottom: "0.1px solid #ddd",
          fontSize: "17.2px",
          fontWeight: "bold",
          backgroundColor: "#fff",
        }}
      >
        Communities
      </h4>

      {/* User List */}
      <div style={{ padding: "10px", flex: 1 }}>
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "background-color 0.2s ease-in-out",
              backgroundColor: selectedUser === user ? "#d0e6ff" : "transparent", // Blue background if selected
            }}
            onClick={() => handleUserClick(user)} // Call the function when the user is clicked
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = selectedUser === user ? "#d0e6ff" : "transparent")}
          >
            {/* Display user profile picture */}
            <img
              src={ProfilePics[user] || "https://via.placeholder.com/30"}
              alt={user}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#000" }}>
              {user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;


