import React, { useState } from "react";

const ChatHeader = ({ currentCommunity, ProfilePics, onSearch, bio }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Trigger the search function
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#fff",
        borderBottom: "0.1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        {currentCommunity && (
          <img
            src={ProfilePics}
            alt="Profile"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", width: "100%" }}>
          <h2 style={{ margin: 0, color: "#032F50", fontSize: "18px" }}>
            {currentCommunity || "."}
          </h2>
          {bio && (
            <span
              style={{
                fontSize: "12px",
                color: "#777",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={bio} // Show full bio on hover
            >
              {bio}
            </span>
          )}
        </div>
      </div>
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
        }}
      />
    </div>
  );
};

export default ChatHeader;

