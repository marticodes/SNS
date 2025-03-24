import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

const Post = ({ post, userID, commentType = 'flat', hashtagClick }) => {
  console.log(post);
  const {
    post_id,
    user_id,  // Author of the post
    content,
    topic,
    hashtag,
    media_url,
    timestamp,
    duration,
    comments = [] // Assuming comments are fetched here already
  } = post;
  const formattedDate = new Date(timestamp).toLocaleDateString();
  const [userData, setUserData] = useState(null);

  const postTimestamp = new Date(timestamp);
  const currentTime = new Date();
  const timeRemaining = postTimestamp.getTime() + duration * 24 * 60 * 60 * 1000 - currentTime.getTime(); // duration in milliseconds

  let timeLeft = '';

  if (timeRemaining > 0) {
    const hoursLeft = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      timeLeft = `${hoursLeft} hours left`;
    } else if (minutesLeft > 0) {
      timeLeft = `${minutesLeft} minutes left`;
    }
  } else {
    timeLeft = '';
  }

  const [reactions, setReactions] = useState({
    likedUsers: [],
    emojiReactions: [],
    upvotes: 0,
    downvotes: 0,
    shares: 0
  });
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
  const [isSharePopupOpen, setSharePopupOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${user_id}`);
        setUserData(res.data);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user_id]);
  
  useEffect(() => {
  const fetchReactions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
        setReactions(res.data);
      } catch (err) {
        console.error('❌ Error fetching reactions:', err);
      }
    };

    fetchReactions();
  }, [post_id]);

  const handleLike = async () => {
    try {
      await axios.post('http://localhost:3001/api/reactions/post/add', {
        reaction_type: 0,
        emote_type: null,
        post_id,
        user_id: userID,
        timestamp: Date.now(),
      });

      // Refresh reactions after like
      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Like Error:', err);
    }
  };

  const handleUpvote = async (change = 1) => {
    try {
      await axios.post('http://localhost:3001/api/reactions/post/add', {
        reaction_type: 1,
        emote_type: null,
        post_id,
        user_id: userID,
        timestamp: Date.now(),
      });

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Upvote Error:', err);
    }
  };

  const handleDownvote = async (change = 1) => {
    try {
      await axios.post('http://localhost:3001/api/reactions/post/add', {
        reaction_type: 2,
        emote_type: null,
        post_id,
        user_id: userID,
        timestamp: Date.now(),
      });

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Downvote Error:', err);
    }
  };

  const handleEmojiSelect = async (emoji) => {
    try {
      await axios.post('http://localhost:3001/api/reactions/post/add', {
        reaction_type: 4,
        emote_type: emoji, 
        post_id,
        user_id: userID,
        timestamp: Date.now(),
      });

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Emoji Reaction Error:', err);
    }
  };

  const toggleCommentSection = () => {
    setCommentSectionOpen((prev) => !prev);
  };

  const toggleSharePopup = () => {
    setSharePopupOpen((prev) => !prev);
  };

  const totalVotes = reactions.upvotes - reactions.downvotes;
  const totalComments = countTotalComments(comments);
  const isOwner = userID === post.user_id;


  return (
    <PostContainer>
    <UserProfile
      user_id={user_id}
      userName={userData?.user_name || "Unknown User"}
      profileImg={userData?.profile_picture || "/default-profile.png"}
      postDate={formattedDate}
      isOwner={isOwner}
      post={post}
      variant="default"
      timeleft={timeLeft}
    />
    <ContentSection
      text={content}
      hashtags={hashtag ? hashtag.split(",") : []}
      images={media_url ? media_url.split(",").filter(Boolean) : []} //Need to check the backend
      hashtagClick={hashtagClick}
    />
      <ReactionSummary
      post_id={post.id}
      reactions={reactions}
      likes={reactions.likedUsers?.length}
      votes={totalVotes}
      comments={totalComments}
      />

    <Reaction
      user={user_id}
      post_id={post_id}
      reactions={reactions}
      onLike={handleLike}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onEmojiSelect={handleEmojiSelect}
      onCommentClick={toggleCommentSection}
      onShareClick={toggleSharePopup}
    />
    {isCommentSectionOpen && (
      <Comments
        post_id={post_id}
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