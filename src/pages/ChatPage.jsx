import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation for accessing navigation state
import UserList from "../components/DMs/users.jsx";
import MessageList from "../components/DMs/messages.jsx";
import MessageInput from "../components/DMs/message_input.jsx";
import ChatHeader from "../components/DMs/chatheader.jsx";
import NavBar from "../components/NavBar/Small.jsx";

const ProfilePics = {
  "Kim Namjoon": "https://via.placeholder.com/30/FF0000/FFFFFF?text=User",
  "Kim Seokjin": "https://via.placeholder.com/30?text=KS",
  "Min Yoongi": "https://via.placeholder.com/30?text=MY",
  "Jung Hoseok": "https://via.placeholder.com/30?text=JH",
  "Park Jimin": "https://via.placeholder.com/30?text=PJ",
  "Kim Taehyung": "https://via.placeholder.com/30?text=KT",
  "Jeon Jungkook": "https://via.placeholder.com/30?text=JK",
  "Me": "https://via.placeholder.com/30?text=Me",
  "Someone Else": "https://via.placeholder.com/30?text=SE",
  "Another Person": "https://via.placeholder.com/30?text=AP",
};

const ChatPage = () => {
  const location = useLocation(); // Hook to access state from navigation
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentChatUser, setCurrentChatUser] = useState(null);

  // On component mount, check if a chat user was passed in the navigation state
  useEffect(() => {
    if (location.state?.chatUser) {
      setCurrentChatUser(location.state.chatUser);
    }
  }, [location.state]);

  const handleSendMessage = (text) => {
    const newMessage = {
      text,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => {
      const userMessages = prev[currentChatUser] || [];
      return {
        ...prev,
        [currentChatUser]: [...userMessages, newMessage],
      };
    });
  };

  const handleUserClick = (user) => {
    setCurrentChatUser(user);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* NavBar */}
      <div
        style={{
          width: "5%",
          height: "100%",
          backgroundColor: "#34495e",
        }}
      >
        <NavBar />
      </div>

      {/* User List */}
      <div
        style={{
          width: "25%",
          height: "100%",
          backgroundColor: "#2c3e50",
          overflowY: "auto",
        }}
      >
        <UserList
          users={[
            "Kim Namjoon",
            "Kim Seokjin",
            "Min Yoongi",
            "Jung Hoseok",
            "Park Jimin",
            "Kim Taehyung",
            "Jeon Jungkook",
            "Me",
            "Someone Else",
            "Another Person",
          ]}
          onUserClick={handleUserClick}
          ProfilePics={ProfilePics}
        />
      </div>

      {/* Chat Section */}
      <div
        style={{
          width: "70%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentChatUser && (
          <>
            <ChatHeader currentChatUser={currentChatUser} ProfilePics={ProfilePics} />
            <MessageList
              messages={messages[currentChatUser] || []}
              currentUser={currentUser}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

