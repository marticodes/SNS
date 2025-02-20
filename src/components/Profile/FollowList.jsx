import React, { useEffect, useState } from "react";

const fetchUserInfo = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Error fetching user info for ID ${userId}`);
    }
    return await response.json(); // Assuming the response is a user object
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchRelation = async (userId, relationType) => {
  try {
    const response = await fetch(`http://localhost:3001/api/relations/${userId}/${relationType}`);
    if (!response.ok) {
      throw new Error(`Error fetching relation for ${userId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};


const FollowingPopup = ({ relation, id, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(255, 255, 255, 0.0s6)",
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

  const headerText = relation === 2 ? "Followers" : "Following";

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      try {
        const userIds = await fetchRelation(id, relation);
        const userDetailsPromises = userIds.map((id) => fetchUserInfo(id));
        const usersData = await Promise.all(userDetailsPromises);

        const validUsers = usersData.filter((user) => user !== null);

        setUsers(validUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all user details:", error);
        setLoading(false);
      }
    };

    fetchAllUserDetails();
  }, [id, relation]); // Re-run if userId or relationType changes

  if (loading) {
    return <div>Loading...</div>;
  }

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
              key={user.user_id}
              style={styles.userRow}
              onClick={() => (window.location.href = `/user/${user.user_id}`)} // Navigate to user profile
            >
              <img
                src={user.profile_picture}
                alt={user.user_name}
                style={styles.avatar}
              />
              <div style={styles.userInfo}>
                <span style={styles.username}>{user.user_name}</span>
                <span style={styles.fullname}>{user.user_bio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowingPopup;