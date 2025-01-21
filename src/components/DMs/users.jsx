import React from "react";

const UserList = ({ users, onUserClick }) => {
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
      <h2 style={{ margin: 0, color: "#032F50", textAlign: "center", paddingBottom: "10px", borderBottom: "0.1px solid #B0BEC5"}}>Messages</h2>
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
              //borderBottom: "0.1px solid #B0BEC5",
              margin: "5px 0",
              borderRadius: "3px",
              color: "#000000",
            }}
            onClick={() => onUserClick(user)} // Call the function when the user is clicked
          >
            <span
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#032F50",                //this is the profile icon that for now is white circle
                borderRadius: "50%",
                marginRight: "10px",
              }}
            ></span>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
