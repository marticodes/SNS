import React from "react";

const UserList = ({ users, onUserClick }) => {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh", // Ensures the sidebar stretches to full page height
        backgroundColor: "#2c3e50",
        color: "#fff",
        padding: "10px",
        overflowY: "auto", // Allows scrolling if there are too many users
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {users.map((user, index) => (
          <li
            key={index}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "#34495e",
              margin: "5px 0",
              borderRadius: "5px",
            }}
            onClick={() => onUserClick(user)} // Call the function when the user is clicked
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
