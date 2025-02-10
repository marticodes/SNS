import React from "react";

const FollowingPopup = ({ foll, users, onClose }) => {
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(255, 255, 255, 0.86)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    container: {
      width: "400px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      backgroundColor: "#fff",
      color: "#2c2c2c",
      fontSize: "12px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#2c2c2c",
      fontSize: "24px",
      cursor: "pointer",
    },
    search: {
      padding: "10px",
      backgroundColor: "#fff",
    },
    searchInput: {
      width: "80%",
      padding: "8px",
      borderRadius: "5px",
      border: "none",
      fontSize: "14px",
      backgroundColor: "#f1f1f1",
      color: "black",
    },
    list: {
      maxHeight: "400px",
      overflowY: "auto",
    },
    userRow: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      cursor: "pointer",
      color: "#2c2c2c",
    },
    userRowHover: {
      backgroundColor: "#333",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "10px",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
    },
    username: {
      fontWeight: "bold",
    },
    fullname: {
      fontSize: "12px",
      color: "#888",
    },
  };

  // Dynamically change the header and list based on "foll"
  const headerText = foll === 1 ? "Followers" : "Following";

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>{headerText}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={styles.search}>
          <input
            type="text"
            placeholder="Search"
            style={styles.searchInput}
          />
        </div>
        <div style={styles.list}>
          {users.map((user) => (
            <div
              key={user.id}
              style={styles.userRow}
              onClick={() => (window.location.href = `/user/${user.id}`)}   //change this
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={styles.avatar}
              />
              <div style={styles.userInfo}>
                <span style={styles.username}>{user.username}</span>
                <span style={styles.fullname}>{user.fullname}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowingPopup;