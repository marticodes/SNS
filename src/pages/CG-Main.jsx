import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserList from "../components/CG/servers.jsx";
import MessageList from "../components/CG/messages.jsx";
import MessageInput from "../components/CG/message_input.jsx";
import ChatHeader from "../components/CG/chatheader.jsx";
import NavBar from "../components/NavBar/Small.jsx";

const CGPage = () => {
  const location = useLocation();
  const userId = localStorage.getItem("userID");
  const [communities, setCommunities] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //this one is to get all the communities

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/channels/${userId}/`);
        const commIds = await res.json();
        const commDetails = await Promise.all(
          commIds.map(async (id) => {
            const infoRes = await fetch(`http://localhost:3001/api/channels/info/${id}/`);
            return infoRes.json();
          })
        );
        setCommunities(commDetails);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };
    fetchCommunities();
  }, [userId]);

  useEffect(() => {
    if (currentCommunity) {
      fetchMessages(currentCommunity.comm_id);
    }
  }, [currentCommunity]);

  useEffect(() => {
    if (location.state?.chatUser) {
      setcurrentCommunity(location.state.chatUser);
    }
  }, [location.state]);

  //this one is to get user info and use it in the next function

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      const userData = await response.json();
      return userData?.user_name || `User ${userId}`;
    } catch (error) {
      console.error("Error fetching user:", error);
      return `User ${userId}`;
    }
  };
  
  //this one is to get all the messages

  const fetchMessages = async (commId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/channels/post/${commId}/`);
      const data = await res.json();
      const formattedMessages = await Promise.all(
        data.map(async (msg) => {
          const senderName = await fetchUserInfo(msg.user_id);
  
          let replyTo = null;
          if (msg.parent_id) {
            const parentMsg = data.find((m) => m.post_id === msg.parent_id);
            if (parentMsg) {
              const parentSenderName = await fetchUserInfo(parentMsg.user_id);
              replyTo = {
                sender: parentSenderName,
                text: parentMsg.content,
              };
            }
          }
          return {
            text: msg.content,
            sender: senderName,
            timestamp: msg.timestamp || "Unknown",
            replyTo,
          };
        })
      );
      setMessages((prev) => ({ ...prev, [commId]: formattedMessages }));
      setFilteredMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = (messages[currentCommunity] || []).filter((msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages[currentCommunity] || []);
    }
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      text,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString(),
      replyTo: replyTo ? { sender: replyTo.sender, text: replyTo.text } : null, // Include reply information if there's a reply
    };

    setMessages((prev) => {
      const userMessages = prev[currentCommunity.comm_id] || [];
      return {
        ...prev,
        [currentCommunity]: [...userMessages, newMessage],
      };
    });
    setReplyTo(null); // Reset reply after sending the message
  };

  const handleCancelReply = () => {
    setReplyTo(null); // Clear the replyTo state
  };

  const handleMessageClick = (message) => {
    setReplyTo(message); // Set the message to reply to
  };

  const handleMessageReply = (message) => {
    setReplyTo(message); // Set the message to reply to
  };
  
  const handleMessageReact = (message, emoji) => {
     // CHANGE THIS WITH POST REQUEST
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        <NavBar caseId={4} />
      <div
        style={{
          width: "251px",
          height: "100%",
          backgroundColor: "#fff",
          overflowY: "auto",
        }}
      >
        <UserList
          users={communities.map((c) => c.comm_name)}
          onUserClick={(name) => {
            const selectedCommunity = communities.find((c) => c.comm_name === name);
            setCurrentCommunity(selectedCommunity);
          }}
          ProfilePics={Object.fromEntries(communities.map((c) => [c.comm_name, c.comm_image]))}
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
        {currentCommunity && (
          <>
            <ChatHeader
              currentCommunity={currentCommunity.comm_name}
              ProfilePics={currentCommunity.comm_image}
              onSearch={handleSearch} // Pass onSearch function
            />
            <MessageList
              messages={filteredMessages} // Use filteredMessages to display only relevant ones
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

export default CGPage;

