import React from "react";
import { FaHome, FaEnvelope, FaBell, FaUser, FaCog } from "react-icons/fa";

const NavBar = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#7CB9E8",
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        color: "#fff",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // For visual enhancement
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        SNS Simulation
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px",  }}>
        <NavItem icon={<FaHome />} label="Home" />
        <NavItem icon={<FaBell />} label="Notifications" />
        <NavItem icon={<FaEnvelope />} label="Messages" />
        <NavItem icon={<FaUser />} label="Profile" />
        <NavItem icon={<FaCog />} label="Settings" /> 
      </div>
    </div>
  );
};

//DO WE NEED SETTINGS? WILL THERE BE SETTINGS?

const NavItem = ({ icon, label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        cursor: "pointer",
        padding: "10px 15px",
        borderRadius: "5px",
        transition: "background-color 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6BAED8")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      title={label} // Tooltip for accessibility
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <span style={{ fontSize: "18px" }}>{label}</span>
    </div>
  );
};

export default NavBar;
