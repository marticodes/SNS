import React, { useState } from "react";


const ChatHeader = ({ currentChatUser, ProfilePics, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Trigger the search function
  };

  return (
    <div style={{ display: "flex", padding: "10px 20px", backgroundColor: "#fff", borderBottom: "0.1px solid #B0BEC5" }}>
      {currentChatUser && (
        <img
          src={ProfilePics[currentChatUser]}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
      )}
      <h2 style={{ margin: 0, color: '#032F50'}}>{currentChatUser || "."}</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search messages..."
        style={{
          padding: "5px 10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          width: "200px",
          backgroundColor: "#fff",
          color: "#555",
          marginLeft: "auto"
        }}
      />
    </div>
  );
};

export default ChatHeader;
