import React, { useState } from "react";
import { FaHome, FaEnvelope, FaBell, FaUser, FaCog } from "react-icons/fa";
import NotificationPanel from "../Notifications";

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundColor: "#7CB9E8",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          color: "#fff",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
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
          i
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignSelf: "center" }}>
          <NavItem icon={<FaHome />} label="Home" />
          <NavItem icon={<FaBell />} label="Notifications" onClick={toggleNotifications} />
          <NavItem icon={<FaEnvelope />} label="Messages" />
          <NavItem icon={<FaUser />} label="Profile" />
          <NavItem icon={<FaCog />} label="Settings" />
        </div>
      </div>

      {/* Conditionally render the NotificationPanel */}
      {showNotifications && <NotificationPanel onClose={toggleNotifications} />}
    </>
  );
};

const NavItem = ({ icon, label, onClick }) => {
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
      onClick={onClick} // Attach click handler
      title={label}
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
    </div>
  );
};

export default NavBar;
