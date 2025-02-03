import React, { useState } from "react";

const communities = [
  { name: "ac_newhorizons", icon: "https://via.placeholder.com/30?text=A" },
  { name: "ActionFigures", icon: "https://via.placeholder.com/30?text=AF" },
  { name: "aldi", icon: "https://via.placeholder.com/30?text=A" },
  { name: "amazonprime", icon: "https://via.placeholder.com/30?text=AP" },
  { name: "amcstock", icon: "https://via.placeholder.com/30?text=AS" },
  { name: "AnalogCommunity", icon: "https://via.placeholder.com/30?text=AC" },
  { name: "announcements", icon: "https://via.placeholder.com/30?text=AN" },
  { name: "ArtHistory", icon: "https://via.placeholder.com/30?text=AH" },
  { name: "AskAnthropology", icon: "https://via.placeholder.com/30?text=AA" },
  { name: "AskPH", icon: "https://via.placeholder.com/30?text=AP" },
];

const Sidebar = ({ onSelectCommunity }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community.name);
    onSelectCommunity(community);
  };

  return (
    <div
      style={{
        width: "250px",
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
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#fff",
        }}
      >
        Communities
      </h4>

      {/* Community List */}
      <div style={{ padding: "10px", flex: 1 }}>
        {communities.map((community, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "background-color 0.2s ease-in-out",
              backgroundColor: selectedCommunity === community.name ? "#d0e6ff" : "transparent",
            }}
            onClick={() => handleCommunityClick(community)}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = selectedCommunity === community.name ? "#d0e6ff" : "#f0f0f0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = selectedCommunity === community.name ? "#d0e6ff" : "transparent")}
          >
            <img
              src={community.icon}
              alt={community.name}
              style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>{community.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

