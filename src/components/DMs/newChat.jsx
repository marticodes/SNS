import React, { useState, useEffect } from 'react';

const NewChat = ({ caseType, followers = [], channelUsers = [] }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (caseType === 2 || caseType === 4) {
      const filtered = channelUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, channelUsers, caseType]);

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleStartChat = () => {
    console.log('Starting chat with:', selectedUsers);
  };

  return (
    <div style={styles.container}>
      {caseType === 1 || caseType === 3 ? (
        <>
          <h2 style={styles.header}>Select Followers</h2>
          <div style={styles.scrollContainer}>
            {followers.map((follower) => (
              <div key={follower.id} style={styles.userItem}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(follower)}
                  onChange={() => handleSelectUser(follower)}
                  style={styles.checkbox}
                />
                <span>{follower.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 style={styles.header}>Search Channel Users</h2>
          <input
            type="text"
            placeholder="Type username(s)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />
          <div style={styles.scrollContainer}>
            {filteredUsers.map((user) => (
              <div key={user.id} style={styles.userItem}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleSelectUser(user)}
                  style={styles.checkbox}
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={styles.buttonContainer}>
        <button
          style={styles.startButton}
          disabled={selectedUsers.length === 0}
          onClick={handleStartChat}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default NewChat;

/* Styles */
const styles = {
  container: {
    padding: "16px",
    width: "400px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#333",
  },
  scrollContainer: {
    maxHeight: "256px",
    overflowY: "auto",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "8px 0",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  searchBar: {
    marginBottom: "16px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "100%",
    outline: "none",
    boxShadow: "0 0 0 2px transparent",
    transition: "box-shadow 0.2s",
  },
  buttonContainer: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
  },
  startButton: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.2s",
    opacity: "1",
    disabledOpacity: "0.5",
  },
};
