import React from "react";
import { FaHome, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const NavBar = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#7CB9E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 0",
      }}
    >

      {/* Navigation Icons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <NavIcon icon={<FaHome />} label="" />
        <NavIcon icon={<FaEnvelope />} label="" />
        <NavIcon icon={<FaUser />} label="" />
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
        color: "#fff",
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
