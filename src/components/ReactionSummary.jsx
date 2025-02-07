import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BiSolidLike, BiUpvote, BiDownvote } from "react-icons/bi";

// Styled Components
const ReactionSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.2rem 0;
  position: relative;
`;

const ReactionDiv = styled.div`
  display: flex;
  gap: 1rem;
`;

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: #555;
  cursor: pointer;
`;

const ReactionNum = styled.span`
  color: #555;
  font-weight: 400;
`;

const LikeSpan = styled.span`
  color: #007bff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SelectedEmoji = styled.span`
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 20;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;

const PopupTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
  color: #007bff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #ddd;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  color: #000000;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const EmojiSpan = styled.span`
  margin-left: auto;
`;


// Component
const ReactionSummary = ({ likes, votes, comments, reactions }) => {
  const [popupOpen, setPopupOpen] = useState(null); 
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  useEffect(() => {
    if (!reactions.emojiReactions || reactions.emojiReactions.length === 0) {
      setSelectedEmoji(null);
    } else {
      const emojiCounts = {};
      reactions.emojiReactions.forEach((reaction) => {
        emojiCounts[reaction.emoji] = (emojiCounts[reaction.emoji] || 0) + 1;
      });

      const mostFrequentEmoji = Object.keys(emojiCounts).reduce((a, b) =>
        emojiCounts[a] > emojiCounts[b] ? a : b
      );

      setSelectedEmoji(mostFrequentEmoji);
    }
  }, [reactions.emojiReactions]);


  return (
    <ReactionSummaryContainer>
      <ReactionDiv>
        <ReactionItem>
          <LikeSpan onClick={() => setPopupOpen("like")}>
            <BiSolidLike />
          </LikeSpan>
          <span>{likes}</span>
        </ReactionItem>
        <ReactionItem>
          <BiUpvote />
          <span>{votes}</span>
          <BiDownvote />
        </ReactionItem>
        {selectedEmoji && (
          <ReactionItem>
            {reactions.emojiReactions.length > 0 && (
            <SelectedEmoji onClick={() => setPopupOpen("emoji")}>
              {selectedEmoji || reactions.emojiReactions[0].emoji} +{reactions.emojiReactions.length}
            </SelectedEmoji>
          )}
          </ReactionItem>
        )}
      </ReactionDiv>

      <ReactionDiv>
      <ReactionItem>
        <ReactionNum>{comments}</ReactionNum> comments
      </ReactionItem>
      <ReactionItem>
        <ReactionNum>{reactions.shares}</ReactionNum> shares
      </ReactionItem>
      </ReactionDiv>

      {popupOpen && (
        <PopupContainer>
          <CloseButton onClick={() => setPopupOpen(null)}>&times;</CloseButton>
          {popupOpen === "like" ? (
            <>
              <PopupTitle>People who liked this post</PopupTitle>
              <UserList>
                {reactions.likedUsers.map((user, index) => (
                  <UserItem key={index}>
                    <ProfileImage src={user.profileImg} alt={user.userName} />
                    {user.userName}
                  </UserItem>
                ))}
              </UserList>
            </>
          ) : (
            <>
              <PopupTitle>Emoji Reactions</PopupTitle>
              <UserList>
                {reactions.emojiReactions.map((reaction, index) => (
                  <UserItem key={index}>
                    <ProfileImage src={reaction.profileImg} alt={reaction.userName} />
                    {reaction.userName}
                    <EmojiSpan>{reaction.emoji}</EmojiSpan>
                  </UserItem>
                ))}
              </UserList>
            </>
          )}
        </PopupContainer>
      )}
    </ReactionSummaryContainer>
  );
};

export default ReactionSummary;