import React, { useState } from 'react';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import ContentSection from './ContentSection';
import ReactionSummary from './reactionSummary';
import Reaction from './Reaction';
import Comments from './Comments';

// Styled Components
const FeedContainer = styled.div`
  width: 33.33%;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1.5rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const SharePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

// Component
const Feed = ({ user, post, commentType = 'flat' }) => {
  const {user_name, profile_picture} = user;
  const { profileImg, userName, postDate, text, hashtags, images, reactions: initialReactions, comments } = post;

  const [reactions, setReactions] = useState(initialReactions);
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
  const [isSharePopupOpen, setSharePopupOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleLike = (isActive) => {
    setReactions((prev) => ({
      ...prev,
      likes: isActive ? prev.likes + 1 : prev.likes - 1,
    }));
  };

  const handleUpvote = (isActive) => {
    setReactions((prev) => ({
      ...prev,
      votes: isActive ? prev.votes + 1 : prev.votes - 1,
    }));
  };

  const handleDownvote = (isActive) => {
    setReactions((prev) => ({
      ...prev,
      votes: isActive ? prev.votes - 1 : prev.votes + 1,
    }));
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const toggleCommentSection = () => {
    setCommentSectionOpen((prev) => !prev);
  };

  const toggleSharePopup = () => {
    setSharePopupOpen((prev) => !prev);
  };

  return (
    <FeedContainer>
      <UserProfile profileImg={profileImg} userName={userName} postDate={postDate} />
      <ContentSection text={text} hashtags={post.hashtags} images={images} />
      <ReactionSummary
        likes={reactions.likes}
        votes={reactions.votes}
        comments={reactions.comments}
        shares={reactions.shares}
        selectedEmoji={selectedEmoji}
      />
      <Reaction
        userProfile={profile_picture}
        userName={user_name}
        originalPost={post}  
        onLike={handleLike}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onCommentClick={toggleCommentSection}
        onShareClick={toggleSharePopup}
        onEmojiSelect={handleEmojiSelect}

      />
        {isCommentSectionOpen && (
        <Comments
          profileImg={profileImg}
          userName={userName}
          initialComments={comments}
          isNested={commentType === 'nested'}
        />
      )}
      {isSharePopupOpen && (
        <>
          <Overlay onClick={toggleSharePopup} />
          <SharePopup>
            <h3>Share This Post</h3>
            <button onClick={toggleSharePopup}>Close</button>
          </SharePopup>
        </>
      )}
    </FeedContainer>
  );
};

export default Feed;