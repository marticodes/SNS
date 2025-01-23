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
      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', color: 'black' }}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            username={msg.username}
            avatar={msg.avatar}
            message={msg.message}
            time={msg.time}
          />
        ))}
      </div>
    );
  };

const ChatFeed = () => {
    return (
      <div style={{ display: "flex", height: "100vh", }}>
        {/* Left Navigation Bar */}
        <div style={{ width: "15%" }}>
          <NavBar />
        </div>
        <div style={{ width: "20%"}}>
          <Sidebar />
        </div>
  
        {/* Middle Chat Feed */}
        <div style={{ flex: 0, padding: "20px", width: "65%" }}>
          <ChatFee />
        </div>

      </div>
    );
  };

export default ChatFeed;
