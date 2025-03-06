import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatList from "../components/DMs/users.jsx";
import MessageList from "../components/DMs/messages.jsx";
import MessageInput from "../components/DMs/message_input.jsx";
import ChatHeader from "../components/DMs/chatheader.jsx";
import NavBar from "../components/NavBar/Small.jsx";

const caseNumb = parseInt(localStorage.getItem("selectedCase"), 10);
const userId = localStorage.getItem("userID");

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [chatList, setchatList] = useState([]);

  useEffect(() => {
    if (location.state?.chatUser) {
      setCurrentChatUser(location.state.chatUser);
    }
  }, [location.state]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/chats/all/${userId}`)
      .then((response) => response.json())
      .then(async (chats) => {
        const updatedChatList = await Promise.all(
          chats.map(async (chat) => {
            let displayName;
            let chatimg;
            if (chat.group_chat === 0) {
              const otherUserId = chat.user_id_1 === userId ? chat.user_id_2 : chat.user_id_1;
              const userResponse = await fetch(`http://localhost:3001/api/user/${otherUserId}`);
              const userData = await userResponse.json();
              displayName = userData.id_name; // Single user name
              chatimg = userData.profile_picture;
            } else {
              const groupResponse = await fetch(`http://localhost:3001/api/members/chat/${chat.chat_id}`);
              const groupData = await groupResponse.json();
              const groupNames = await Promise.all(
                groupData.map(async (member) => {
                  const userResponse = await fetch(`http://localhost:3001/api/user/${member}`);
                  const userData = await userResponse.json();
                  return userData.id_name;
                })
              );
              displayName = groupNames.join(", "); // Group member names
              chatimg = "https://via.placeholder.com/30";
            }
            return { chat_id: chat.chat_id, name: displayName, image: chatimg }; // Include chat_id with the name
          })
        );
        console.log(updatedChatList);
        setchatList(updatedChatList);
      });
  }, []);  

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

  const handleUserClick = (chat) => {
    setCurrentChatUser(chat.name);
    setCurrentChatId(chat.chat_id); 
  };

  const handleMessageReply = (message) => {
    setReplyTo(message); // Set the message to reply to
  };
  
  const handleMessageReact = (message, emoji) => {
     // CHANGE THIS WITH POST REQUEST
  };

  const handlechatListUpdate = (newChat) => {
    setchatList((prevList) => [...prevList, newChat.name]); // Add the new chat to the list
    setMessages((prev) => ({
      ...prev,
      [newChat.name]: [], // Initialize an empty message list for the new chat
    }));
    setCurrentChatUser(newChat.name); // Navigate to the new chat
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* NavBar */}
      <div style={{ width: "70px", height: "100%", backgroundColor: "#34495e" }}>
      <NavBar caseId={caseNumb}/>
      </div>

      {/* User List */}
      <div
        style={{
          width: "250px",
          height: "100%",
          backgroundColor: "#2c3e50",
          overflowY: "auto",
        }}
      >
        <ChatList
          users={chatList}
          onUserClick={handleUserClick}
          onchatListUpdate={handlechatListUpdate} // Pass the function to update the user list
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
              ProfilePics={chatList.find((chat) => chat.name === currentChatUser)?.image}
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

export default ChatPage;

