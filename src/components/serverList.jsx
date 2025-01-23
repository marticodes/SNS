import React from "react";

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
  // Add communities from the API response here FOR NOW RANDOM once
];

const Sidebar = () => {
  return (
    <div style={{ width: "250px", backgroundColor: "#7CB9E8", color: "#ffffff", height: "100vh", padding: "10px" }}>
      <h4 style={{ padding: "10px", borderBottom: "1px solid #333" }}>Communities</h4>
      <div style={{ marginTop: "10px" }}>
        {communities.map((community, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", padding: "10px", cursor: "pointer", borderRadius: "5px", transition: "background-color 0.2s" }} 
               onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#6BAED8"} 
               onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
            <img src={community.icon} alt={community.name} style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
            <span>{community.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
