import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
};

const CFPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState({
    "Kim Namjoon": [
      { text: "Hey, what's up?", sender: "Kim Namjoon", timestamp: "10:15 AM" },
      { text: "Not much, just chilling. You?", sender: "Me", timestamp: "10:16 AM" },
      { text: "Same here. Want to grab coffee later?", sender: "Kim Namjoon", timestamp: "10:17 AM" },
    ],
    "Kim Seokjin": [
      { text: "How was your day?", sender: "Kim Seokjin", timestamp: "9:30 AM" },
      { text: "Pretty good, thanks! How about you?", sender: "Me", timestamp: "9:31 AM" },
      { text: "Busy as usual, but manageable.", sender: "Kim Seokjin", timestamp: "9:32 AM" },
    ],
    "Min Yoongi": [
      { text: "Got any plans for the weekend?", sender: "Min Yoongi", timestamp: "5:00 PM" },
      { text: "I was thinking about a movie night. You?", sender: "Me", timestamp: "5:01 PM" },
      { text: "Sounds good. What movie?", sender: "Min Yoongi", timestamp: "5:02 PM" },
    ],
  });
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

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
      replyTo: replyTo ? { sender: replyTo.sender, text: replyTo.text } : null, // Include reply information if there's a reply
    };

    setMessages((prev) => {
      const userMessages = prev[currentChatUser] || [];
      return {
        ...prev,
        [currentChatUser]: [...userMessages, newMessage],
      };
    });
    setReplyTo(null); // Reset reply after sending the message
  };

  useEffect(() => {
      setFilteredMessages(messages[currentChatUser] || []);
    }, [currentChatUser, messages]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = (messages[currentChatUser] || []).filter((msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages[currentChatUser] || []);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null); // Clear the replyTo state
  };

  const handleUserClick = (user) => {
    setCurrentChatUser(user);
  };

  const handleMessageReply = (message) => {
    setReplyTo(message); // Set the message to reply to
  };
  
  const handleMessageReact = (message, emoji) => {
     // CHANGE THIS WITH POST REQUEST
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* NavBar */}
        <NavBar caseId={3} />
      {/* User List */}
      <div
        style={{
          width: "250px",
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
          ]}
          onUserClick={handleUserClick}
          ProfilePics={ProfilePics}
        />
      </div>

      {/* Chat Section */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentChatUser && (
          <>
            <ChatHeader
              currentChatUser={currentChatUser}
              ProfilePics={ProfilePics}
              onSearch={handleSearch} // Pass onSearch function
            />
            <MessageList
              messages={filteredMessages}
              currentUser={currentUser}
              onReply={handleMessageReply}
              onReact={handleMessageReact}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              replyTo={replyTo} // Show the message being replied to
              onCancelReply={handleCancelReply} // Handle cancel reply
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CFPage;