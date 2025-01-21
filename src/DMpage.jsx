import React, { useState } from 'react';
import UserList from '../src/components/DMs/users';
import MessageList from '../src/components/DMs/messages';
import MessageInput from '../src/components/DMs/message_input';
import ChatHeader from '../src/components/DMs/chatheader';
import NavBar from '../src/components/NavBar/Small.jsx';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentChatUser, setCurrentChatUser] = useState(null); // Track the selected user

  const handleSendMessage = (text) => {
    const newMessage = {
      text,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleUserClick = (user) => {
    setCurrentChatUser(user); // Update the selected user
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
          width: "25%", // UserList takes up 20% of the width
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
            "Another Person",        //this is the list of users that will be displayed on the left side of the screen
          ]}
          onUserClick={handleUserClick}
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
        <ChatHeader currentChatUser={currentChatUser} />
        <MessageList messages={messages} currentUser={currentUser} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;