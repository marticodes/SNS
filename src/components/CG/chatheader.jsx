import React from "react";

const ChatHeader = ({ currentChatUser, ProfilePics }) => {
  // console.log(ProfilePics[currentChatUser]);      WORKING JUST DUMMY IMAGE DOESNT WORK
  return (
    <div style={{ display: "flex", padding: "10px 20px", backgroundColor: "#fff", borderBottom: "0.1px solid #ddd" }}>
      {currentChatUser && (
        <img
          src={ProfilePics[currentChatUser]}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
      )}
      <h2 style={{ margin: 0, color: '#032F50'}}>{currentChatUser || "."}</h2>
    </div>
  );
};

export default ChatHeader;
