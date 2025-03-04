import React, { useEffect, useRef } from "react";
import SingleMessage from "./oneMessage";

const MessageList = ({ messages, onReply, onReact }) => {
  const messageListRef = useRef(null); 
  const messageRefs = useRef({}); // Store refs for each message

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Store refs for messages when they are loaded
  useEffect(() => {
    messages.forEach((msg) => {
      if (!messageRefs.current[msg.post_id]) {
        messageRefs.current[msg.post_id] = React.createRef();
      }
    });
  }, [messages]);

  // Function to scroll to a specific message
  const scrollToMessage = (postId) => {
    const messageElement = messageRefs.current[postId]?.current;
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      ref={messageListRef}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#fff",
      }}
    >
      {messages.map((message) => (
        <div key={message.post_id} ref={messageRefs.current[message.post_id]}>
          <SingleMessage
            message={message}
            onReply={onReply}
            onReact={onReact}
            scrollToMessage={scrollToMessage} // Pass scroll function to SingleMessage
          />
        </div>
      ))}
    </div>
  );
};

export default MessageList;