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

const Post = ({ post, userID, commentType = 'flat', hashtagClick }) => {
  const {
    post_id,
    user_id,  // Author of the post
    content,
    topic,
    hashtag,
    media_url,
    timestamp,
    duration,
    parent_id, // Check for parent_id
  } = post;

  const formattedDate = new Date(timestamp).toLocaleDateString();
  const [userData, setUserData] = useState(null);
  const [parentPostData, setParentPostData] = useState(null); // State to store parent post data
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
  const [comments, setComments] = useState([]);

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

  // Fetch the parent post if parent_id exists
  useEffect(() => {
    if (parent_id) {
      const fetchParentPost = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/api/posts/id/${parent_id}`);
          setParentPostData(res.data);
        } catch (err) {
          console.error("❌ Error fetching parent post:", err);
        }
      };

      fetchParentPost();
    }
  }, [parent_id]);

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

  const toggleCommentSection = () => {
    setCommentSectionOpen((prev) => !prev);
  };

  const toggleSharePopup = () => {
    setSharePopupOpen((prev) => !prev);
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/comments/all/${post_id}/1`);
      setComments(res.data);
    } catch (err) {
      console.error("❌ Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  const totalVotes = reactions.upvotes - reactions.downvotes;
  const totalComments = comments.length;
  const isOwner = userID === post.user_id;

  return (
    <div>

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
        images={media_url ? media_url.split(",").filter(Boolean) : []}
        hashtagClick={hashtagClick}
      />
      {parentPostData && parent_id ? (
        <div style={{ 
          marginBottom: '2px', 
          padding: '5px', 
          borderLeft: '2px solid #0073e6', 
          borderRadius: '8px', 
          backgroundColor: '#f0f8ff', 
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' 
        }}>
          <h4 style={{ fontSize: '14px', fontStyle: 'italic', color: '#555', marginBottom: '8px' }}>
            Reposted from:
          </h4>
          {/* Display Parent Post */}
          <div style={{ marginBottom: '6px', fontSize: '14px', color: '#333', fontWeight: 'bold' }}>
            {parentPostData.user_name || "Unknown User"} - {new Date(parentPostData.timestamp).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '15px', color: '#444' }}>
            <p style={{ marginBottom: '6px' }}>{parentPostData.content}</p>
            {parentPostData.media_url && (
              <div>
                <img 
                  src={parentPostData.media_url} 
                  alt="Parent Post Media" 
                  style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '5px' }} 
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
      <ReactionSummary
        post_id={post_id}
        reactions={reactions}
        likes={reactions.likedUsers.length}
        votes={totalVotes}
        comments={totalComments}
      />
      <Reaction
        user={user_id}
        post_id={post_id}
        reactions={reactions}
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
    </div>
  );
};

export default Post;