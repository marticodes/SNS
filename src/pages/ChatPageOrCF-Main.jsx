import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../components/DMs/users.jsx";
import MessageList from "../components/DMs/messages.jsx";
import MessageInput from "../components/DMs/message_input.jsx";
import ChatHeader from "../components/DMs/chatheader.jsx";
import NavBar from "../components/NavBar/Small.jsx";

const caseNumb = parseInt(localStorage.getItem("selectedCase"), 10);

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userID"), 10);
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState("Me");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [chatList, setchatList] = useState([]);
  const [isGroup, setIsGroup] = useState(0);
  


  // Initialize chat when chatId changes
  useEffect(() => {
    const initializeChat = async () => {
      if (!chatId) {
        console.log("No chatId provided in URL");
        return;
      }
      
      setCurrentChatId(chatId);

      try {
        // Step 1: Fetch chat info
        const chatResponse = await fetch(`http://localhost:3001/api/chat/${chatId}`);
        if (!chatResponse.ok) {
          console.error("Failed to fetch chat info:", chatResponse.status);
          throw new Error(`Failed to fetch chat info: ${chatResponse.status}`);
        }
        const chatInfo = await chatResponse.json();

        if (!chatInfo) {
          throw new Error("No chat info received");
        }

        // Step 2: Get user/group info based on chat type
        if (chatInfo.group_chat === 0) {
          // Direct message
          const otherUserId = parseInt(chatInfo.user_id_1, 10) === userId 
            ? parseInt(chatInfo.user_id_2, 10) 
            : chatInfo.user_id_1;
          
          console.log("Fetching user info for ID:", otherUserId);
          const userResponse = await fetch(`http://localhost:3001/api/user/${otherUserId}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user info: ${userResponse.status}`);
          }
          const userData = await userResponse.json();
          
          if (!userData || !userData.user_name) {
            throw new Error("Invalid user data received");
          }
          
          setCurrentChatUser(userData.user_name);
        } else {
          // Group chat
          const groupResponse = await fetch(`http://localhost:3001/api/members/chat/${chatId}`);
          if (!groupResponse.ok) {
            throw new Error(`Failed to fetch group members: ${groupResponse.status}`);
          }
          const groupData = await groupResponse.json();
          console.log("Group members received:", groupData);
          
          const groupNames = await Promise.all(
            groupData.map(async (member) => {
              const userResponse = await fetch(`http://localhost:3001/api/user/${member}`);
              const userData = await userResponse.json();
              return userData.user_name;
            })
          );
          
          const groupName = groupNames.join(", ");
          console.log("Setting group name:", groupName);
          setCurrentChatUser(groupName);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        // Don't set Unknown User, let the UI handle the null state
        setCurrentChatUser(null);
      }
    };

    initializeChat();
  }, [chatId, userId]);

  // Add debug logging for state changes
  useEffect(() => {
    //console.log("State update - currentChatUser:", currentChatUser);
    //console.log("State update - currentChatId:", currentChatId);
  }, [currentChatUser, currentChatId]);

  useEffect(() => {
    const fetchChats = () => {
      console.log('Fetching chats for user:', userId);
      fetch(`http://localhost:3001/api/chats/all/${userId}`)
        .then((response) => response.json())
        .then(async (chats) => {
          console.log('Raw chats data:', chats);
          const updatedChatList = await Promise.all(
            chats.map(async (chat) => {
              console.log('Processing chat:', chat);
              let displayName;
              let chatimg;
              if (chat.group_chat === 0) {
                const otherUserId = parseInt(chat.user_id_1, 10) === userId ? parseInt(chat.user_id_2, 10) : chat.user_id_1;
                console.log('Direct message - other user ID:', otherUserId);
                const userResponse = await fetch(`http://localhost:3001/api/user/${otherUserId}`);
                const userData = await userResponse.json();
                displayName = userData.user_name;
                chatimg = userData.profile_picture;
              } else {
                console.log('Group chat - chat ID:', chat.chat_id);
                const groupResponse = await fetch(`http://localhost:3001/api/members/chat/${chat.chat_id}`);
                const groupData = await groupResponse.json();
                const groupNames = await Promise.all(
                  groupData.map(async (member) => {
                    const userResponse = await fetch(`http://localhost:3001/api/user/${member}`);
                    const userData = await userResponse.json();
                    return userData.user_name;
                  })
                );
                displayName = groupNames.join(", ");
                chatimg = null;
              }
              const processedChat = { chat_id: chat.chat_id, name: displayName, image: chatimg, group_chat: chat.group_chat };
              //console.log('Processed chat:', processedChat);
              return processedChat;
            })
          );
          //console.log('Final updated chat list:', updatedChatList);
          setchatList(updatedChatList);
        })
        .catch(error => {
          console.error('Error fetching chats:', error);
        });
    };
    fetchChats();
    const intervalId = setInterval(fetchChats, 4000);
    return () => clearInterval(intervalId);
  }, [userId]);


  useEffect(() => {
    if (currentChatId) {
      const intervalId = setInterval(() => {
        fetch(`http://localhost:3001/api/user/messages/all/${currentChatId}`)
          .then((response) => response.json())
          .then((fetchedMessages) => {
            const transformedMessages = fetchedMessages.map((msg) => ({
              id: msg.message_id,
              text: msg.content,
              sender: msg.sender_id,
              timestamp: msg.timestamp || "N/A",
              replyTo: msg.reply_id, 
            }));
            setMessages((prev) => ({
              ...prev,
              [currentChatId]: transformedMessages, 
            }));
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });
      }, 1000); //update chat every 0.5 seconds SO THAT I CAN GET MESSAGES FROM THE DATABASE CONSTANTLY 
      //Is there a better way to do this? because it might be really costly...
  
      return () => clearInterval(intervalId);
    }
  }, [currentChatId]);
  

  useEffect(() => {
    setFilteredMessages(messages[currentChatId] || []);
  }, [currentChatId, messages]);

  const handleSendMessage = async (text) => {
  
    try {
      const response = await fetch('http://localhost:3001/api/messages/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: currentChatId,
          sender_id: userId,
          reply_id: replyTo?.id || null,     //THIS IS WRONG MUST CHANGE???? but with what...
          content: text,
          media_type: null, // Modify as needed
          media_url: null, // Modify as needed
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = (messages[currentChatId] || []).filter((msg) =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages[currentChatId] || []);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleUserClick = async (chat) => {
    // First update the local state
    setCurrentChatUser(chat.name);
    setCurrentChatId(chat.chat_id);
    
    // Wait for the next render cycle to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Then navigate
    navigate(`/dms/${chat.chat_id}`);
  };

  const handleMessageReply = (message) => {
    setReplyTo(message);
  };

  const handlechatListUpdate = (newChat) => {
    setchatList((prevList) => [...prevList, { chat_id: newChat.id, name: newChat.name, image: "https://via.placeholder.com/30" }]);
    setMessages((prev) => ({
      ...prev,
      [newChat.id]: [],
    }));
    setCurrentChatUser(newChat.name);
    setCurrentChatId(newChat.id);
  };

  // Update isGroup whenever chatList or currentChatId changes
  useEffect(() => {
    if (chatList.length > 0 && currentChatId) {
      const foundChat = chatList.find(chat => {
        const chatIdNum = parseInt(chat.chat_id, 10);
        const currentChatIdNum = parseInt(currentChatId, 10);
        console.log('Comparing chat IDs:', {
          chatId: chatIdNum,
          currentChatId: currentChatIdNum,
          groupChat: chat.group_chat
        });
        return chatIdNum === currentChatIdNum;
      });
      
      if (foundChat) {
        console.log('Found chat:', foundChat);
        setIsGroup(foundChat.group_chat);
      } else {
        console.log('No matching chat found');
      }
    }
  }, [chatList, currentChatId]);

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw",
      margin: 0,
      padding: 0,
      overflow: "hidden"
    }}>
      {/* NavBar */}
      <div style={{ 
        width: "70px", 
        height: "100%", 
        backgroundColor: "#34495e",
        flexShrink: 0
      }}>
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
          onchatListUpdate={handlechatListUpdate}
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
              ProfilePics={chatList.find(chat => chat.name === currentChatUser)?.image || `https://picsum.photos/seed/${encodeURIComponent(currentChatUser)}/30/30`}
              onSearch={handleSearch}
            />
            <MessageList
              messages={filteredMessages}
              chatId={currentChatId}
              onReply={handleMessageReply}
              isGroup={isGroup}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              replyTo={replyTo}
              onCancelReply={handleCancelReply}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;