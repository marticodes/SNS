import React, { useState } from "react";
import { FaHome, FaEnvelope, FaBell, FaUser } from "react-icons/fa";
import NotificationPanel from "../Notifications";


const NavBar = ({ caseId }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const renderNavItems = () => {
    switch (caseId) {
      case 1:
        return (
          <>
            <NavItem icon={<FaHome />} label="Home" link="/case/1" />
            <NavItem
              icon={<FaBell />}
              label="Notifications"
              onClick={toggleNotifications}
            />
            <NavItem icon={<FaEnvelope />} label="Messages" link="/dms" />
            <NavItem icon={<FaUser />} label="Profile" link="/user" />
          </>
        );
      case 2:
        return (
          <>
            <NavItem icon={<FaHome />} label="Home" link="/case/2" />
            <NavItem
              icon={<FaBell />}
              label="Notifications"
              onClick={toggleNotifications}
            />
            <NavItem icon={<FaEnvelope />} label="Messages" link="/dms" />
            <NavItem icon={<FaUser />} label="Profile" link="/user" />
          </>
        );
      case 3:
        return <NavItem icon={<FaHome />} label="Home" link="/case/3" />;
      case 4:
        return (
          <>
            <NavItem icon={<FaHome />} label="Home" link="/case/4" />
            <NavItem
              icon={<FaBell />}
              label="Notifications"
              onClick={toggleNotifications}
            />
            <NavItem icon={<FaEnvelope />} label="Messages" link="/dms" />
          </>
        );
      default:
        return null;
    }
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignSelf: "center",
          }}
        >
          {renderNavItems()}
        </div>
      </div>

      {/* Conditionally render the NotificationPanel */}
      {showNotifications && <NotificationPanel onClose={toggleNotifications} />}
    </>
  );
};

const NavItem = ({ icon, label, link, onClick }) => {
  return (
    <a
      href={link}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        cursor: "pointer",
        padding: "10px 15px",
        borderRadius: "5px",
        textDecoration: "none",
        color: "inherit",
        transition: "background-color 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6BAED8")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      title={label}
      onClick={onClick} // Attach click handler
    >
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <span style={{ fontSize: "18px" }}>{label}</span>
    </a>
  );
};

export default NavBar;