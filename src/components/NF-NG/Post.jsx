import React, { useState } from "react";
import styled from "styled-components";
import UserProfile from "./UserProfile";
import ContentSection from "./ContentSection";
import ReactionSummary from "./ReactionSummary";
import Reaction from "./Reaction";
import Comments from "./Comments";

const PostContainer = styled.div`
  margin-bottom: 0rem;
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

const countTotalComments = (comments) => {
    if (!comments || !Array.isArray(comments)) return 0;
  
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? comment.replies.length : 0);
    }, 0);
  };

const Post = ({ user, post, commentType = 'flat' }) => {
    const {user_name, profile_picture} = user;
    const { profileImg, userName, postDate, text, hashtags, images, reactions: initialReactions, comments } = post;
  
    const [reactions, setReactions] = useState(initialReactions);
    const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
    const [isSharePopupOpen, setSharePopupOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
  
    const likes = reactions.likedUsers.length;
    const upvotes = Number(reactions.upvotedUsers) || 0;
    const downvotes = Number(reactions.downvotedUsers) || 0;
    const votes = upvotes - downvotes;
    const totalComments = countTotalComments(comments);

    const isOwner = user.user_name === post.userName; 

    const handleLike = (updatedLikedUsers) => {
        setReactions((prev) => ({
          ...prev,
          likedUsers: updatedLikedUsers,
        }));
      };
  
    const handleUpvote = (change) => {
    setReactions((prev) => ({
        ...prev,
        upvotedUsers: prev.upvotedUsers + change, 
    }));
    };
  
    const handleDownvote = (change) => {
        setReactions((prev) => ({
          ...prev,
          downvotedUsers: prev.downvotedUsers + change, 
        }));
    };
  
    const handleEmojiSelect = (updatedEmojiReactions) => {
        setReactions((prev) => ({
          ...prev,
          emojiReactions: updatedEmojiReactions,
        }));
      };
  
    const toggleCommentSection = () => {
      setCommentSectionOpen((prev) => !prev);
    };
  
    const toggleSharePopup = () => {
      setSharePopupOpen((prev) => !prev);
    };
  
    return (
      <PostContainer>
        <UserProfile profileImg={profileImg} userName={userName} postDate={postDate} isOwner={isOwner} />
        <ContentSection text={text} hashtags={post.hashtags} images={images} />
        <ReactionSummary
        likes={likes}
        votes={votes}
        comments={totalComments}
        shares={reactions.shares}
        reactions={reactions}
        />

      <Reaction
        user={user}
        originalPost={post} 
        userProfile={profile_picture}
        userName={user_name}
        reactions={reactions}
        onLike={handleLike}
        onEmojiSelect={handleEmojiSelect}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onCommentClick={toggleCommentSection}
        onShareClick={toggleSharePopup}
        />
        {isCommentSectionOpen && (
        <Comments
            userProfile={profile_picture}
            userName={user_name}
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
      </PostContainer>
    );
  };
  
  export default Post;