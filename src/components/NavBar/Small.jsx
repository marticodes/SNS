import React from "react";
import { FaHome, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const NavBar = () => {
  return (
    <div
      style={{
        width: "60px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "#34495e",
          borderRadius: "50%",
          marginBottom: "20px",
        }}
      ></div>

      {/* Navigation Icons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <NavIcon icon={<FaHome />} label="Home" />
        <NavIcon icon={<FaEnvelope />} label="Messages" />
        <NavIcon icon={<FaUser />} label="Profile" />
        <NavIcon icon={<FaCog />} label="Settings" />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, label }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        color: "#ecf0f1",
      }}
      title={label} // Tooltip for accessibility
    >
      <div style={{ fontSize: "20px" }}>{icon}</div>
      <span style={{ fontSize: "12px", marginTop: "5px", color: "#bdc3c7" }}>
        {label}
      </span>
    </div>
  );
};

export default NavBar;
