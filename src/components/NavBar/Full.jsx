import React, { useState, useRef, useEffect } from "react";
import { FaHome, FaEnvelope, FaBell, FaUser } from "react-icons/fa";
import NotificationPanel from "../Notifications";
import image from "../../assets/logo.png";

const UserId = parseInt(localStorage.getItem("userID"), 10);


const NavBar = ({ caseId }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const profileCardRef = useRef(null);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/user/${UserId}`);
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <NavItem icon={<FaUser />} label="Profile" link={`/user/${UserId}`} />
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
            <NavItem icon={<FaUser />} label="Profile" link={`/user/${UserId}`}  />
          </>
        );
      case 3:
        return (
          <>
        <NavItem icon={<FaHome />} label="Home" link="/case/3" />
        <div> 
            <NavItem
              icon={<FaUser />}
              label="Profile"
              onClick={handleProfileClick}
            />
            {showProfile && (
              <div ref={profileCardRef} style={profileCardContainerStyle}>
              <ProfileCard
                username={userInfo.user_name}
                id={UserId}
                idname={userInfo.id_name}
                userPic={userInfo.profile_picture}
                bio={userInfo.user_bio}
              />
            </div>
            )}
            </div>
        </>
        );
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
            <div> 
            <NavItem
              icon={<FaUser />}
              label="Profile"
              onClick={handleProfileClick}
            />
            {showProfile && (
              <div ref={profileCardRef} style={profileCardContainerStyle}>
              <ProfileCard
                username={userInfo.user_name}
                id={UserId}
                idname={userInfo.id_name}
                userPic={userInfo.profile_picture}
                bio={userInfo.user_bio}
              />
            </div>
            )}
            </div>
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
          <img src={image} alt="Logo" style={{
          width: "70px",         
          height: "auto",       
        }} 
        />
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