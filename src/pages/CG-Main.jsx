import React from 'react';
import ChatMessage from "../components/ChatMessage";
import NavBar from "../components/NavBar/Small"; // Adjust the import path as needed
import Sidebar from "../components/serverList"; // Adjust the import path as needed

const messages = [
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },
  {
    username: 'nadir',
    avatar: 'https://placekitten.com/40/40',
    message: 'cursus viverra hendrerit\noin vestibulum luctus nunc vel consectetu',
    time: '5:17 PM',
  },  
  // Add more messages here
];

const ChatFee = () => {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '10px', 
      borderRadius: '8px', 
      color: 'black', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      width: "100%", // Fills the dynamic space
      maxWidth: "900px", // Prevents excessive stretching
    }}>
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          username={msg.username}
          avatar={msg.avatar}
          message={msg.message}
          time={msg.time}
          style={{ alignSelf: "flex-start", width: "100%" }}
        />
      ))}
    </div>
  );
};



const ChatFeed = () => {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ width: "70px", height: "100%", backgroundColor: "#34495e" }}>
        <NavBar />
      </div>
      <div style={{ width: "255px", backgroundColor: "#fff" }}>
        <Sidebar />
      </div>
      {/* ChatFee Section - Takes up remaining space */}
      <div style={{ flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column", }}> 
        <ChatFee />
      </div>
    </div>
  );
};


export default ChatFeed;
