import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewChat = ({ caseType, closeModal, onUserListUpdate }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("userID"), 10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users/active/info");
        const formattedUsers = response.data.map((user) => ({
          id: user.user_id,
          name: user.user_name,
          image: user.profile_picture,
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u !== user));
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      const userToAdd = users.find(
        (user) => user.name.toLowerCase() === searchTerm.toLowerCase()
      );
      if (userToAdd && !selectedUsers.includes(userToAdd)) {
        setSelectedUsers((prev) => [...prev, userToAdd]);
      }
      setSearchTerm(""); // Clear search bar after adding
    }
  };

  const handleStartChat = async () => {
    if (selectedUsers.length === 0) return;
  
    console.log(selectedUsers);
  
    try {
      let response;
      let newChat;
  
      if (selectedUsers.length === 1) {
        // 1-to-1 Chat
        const user1Id = selectedUsers[0].id;
        console.log(user1Id);
  
        response = await fetch("http://localhost:3001/api/chats/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id_1: userId, 
            user_id_2: user1Id,
            chat_name: null,
            chat_image: null,
          }),
        });
  
      } else {
        // Group Chat
        const userIds = selectedUsers.map(user => user.id);
        console.log(userIds);
  
        response = await fetch("http://localhost:3001/api/chats/group/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_ids: userIds,
            chat_name: selectedUsers.map(user => user.name).join(", "), 
            chat_image: null,
          }),
        });
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      newChat = {
        id: data.ina, // Get the chat ID from API response
        name: selectedUsers.length === 1 ? selectedUsers[0].name : selectedUsers.map(user => user.name).join(", "),
        users: selectedUsers,
      };
  
      onUserListUpdate(newChat);
  
      if (caseType === 1 || caseType === 2 || caseType === 4) 
        navigate("/dms", { state: { chatUser: newChat.name } });
      if (caseType === 3) 
        navigate("/case/3", { state: { chatUser: newChat.name } });
  
      closeModal();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };  

  if (caseType === 1 || caseType === 3) {
    return (
      <div style={styles.container}>
        <button style={styles.closeButton} onClick={closeModal}>
          X
        </button>
        <h2 style={styles.header}>New Message</h2>

        {/* Selected Users Section */}
        <div style={styles.selectedUsersContainer}>
          {selectedUsers.map((user) => (
            <div key={user.id} style={styles.selectedUserChip}>
              {user.name}
              <button
                style={styles.removeButton}
                onClick={() => handleRemoveUser(user)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchEnter}
          style={styles.searchBar}
        />

        <div style={styles.scrollContainer}>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              style={styles.userItem}
              onClick={() => handleSelectUser(user)}
            >
              <img src={user.image} alt={user.name} style={styles.userImage} />
              <span style={styles.userName}>{user.name}</span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user)}
                onClick={(e) => e.stopPropagation()} // FIXED BY ADDING THIS: Prevents parent <div> click
                onChange={() => handleSelectUser(user)}
                style={styles.checkbox}
              />
            </div>
          ))}
        </div>

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
  }

  if (caseType === 2 || caseType === 4) {
    return (
      <div style={styles.container}>
        <button style={styles.closeButton} onClick={closeModal}>
          X
        </button>
        <h2 style={styles.header}>New Chat</h2>
        <p style={styles.text1}>Search for people in your community by their username</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Type username(s)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />

        {/* Filtered User Suggestions */}
        {searchTerm && (
          <div style={styles.suggestionsContainer}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                style={styles.suggestionItem}
                onClick={() => handleSelectUser(user)}
              >
                {user.name}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div style={styles.noResults}>No users found</div>
            )}
          </div>
        )}

        {/* Selected Users */}
        <div style={styles.selectedUsersContainer}>
          {selectedUsers.map((user) => (
            <div key={user.id} style={styles.selectedUserChip}>
              {user.name}
              <button
                style={styles.removeButton}
                onClick={() => handleRemoveUser(user)}
              >
                X
              </button>
            </div>
          ))}
        </div>

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
  }
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    position: "absolute",
    top: "40px",
    right: "10px",
    color: "#333",
  },
  header: {
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  text1: { 
    fontSize: "12px",
    color: "#333",
    marginBottom: "4px",
  },
  selectedUsersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    backgroundColor: "#F4FAFF",
    margin: "5px 0",
    borderRadius: "3px",
    color: "#000000",
  },
  noResults: {
    padding: "10px",
    color: "#333",
  },
  selectedUserChip: {
    backgroundColor: "#7CB9E8",
    padding: "5px 10px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  removeButton: {
    background: "none",
    border: "none",
    fontSize: "8px",
    cursor: "pointer",
    color: "#fff",
  },
  scrollContainer: {
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "20px",
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    cursor: "pointer",
  },
  userImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
    border: "1px solid #ddd",
  },
  userName: {
    flexGrow: 1,
    marginLeft: "10px",
    fontSize: "16px",
    color: "#333",
  },
  checkbox: {
    marginLeft: "10px",
    cursor: "pointer",
    transform: "scale(1.4)",
  },
  searchBar: {
    width: "94%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "4px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  startButton: {
    padding: "10px 20px",
    backgroundColor: "#7CB9E8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default NewChat;
