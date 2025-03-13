import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import { RiShareForwardLine } from "react-icons/ri";
import { BiLike, BiSolidLike, BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote, BiComment, BiRepost } from 'react-icons/bi';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import axios from "axios";

// Styled Components
const ReactionSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.8rem 0;
  border-top: 1px solid #e0e0e0;
`;

const ReactionDiv = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #555;
`;

const ReactionNum = styled.span`
  color: #555; 
  font-weight: 400;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.show ? 'block' : 'none')};
  z-index: 1000;
`;

const EmojiOption = styled.span`
  font-size: 1.5rem;
  cursor: pointer;
  margin: 5px;

  &:hover {
    transform: scale(1.2);
  }
`;

const SelectedEmoji = styled.span`
  font-size: 1rem;
  margin-left: 5px;
`;

//Repost
const RepostPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  width: 40%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #000000;
  resize: none;
  background-color: #FFFFFF;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const RepostCard = styled.div`
  width: 60%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  color: #000000;
  background: #f9f9f9;
`;

const RepostContent = styled.p`
  font-size: 1rem;
  color: #333;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  background: #ccc;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #999;
  }
`;

//Direct Share
const SharePopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  color: #0056b3;
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

const ChatroomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const ChatroomItem = styled.li`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: #000;
  border-bottom: 1px solid #e0e0e0;
  &:hover {
    background: #f0f0f0;
  }
`;

const ChatroomImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const CloseButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

// Component
const Reaction = ({ user, post_id, onCommentClick }) => {  
  const userID = user.user_id;
  const [reactions, setReactions] = useState({
    likedUsers: [],
    emojiReactions: [],
    upvotes: 0,
    downvotes: 0,
    shares: 0
  });

  const [likeActive, setLikeActive] = useState(false);
  const [upvoteActive, setUpvoteActive] = useState(false);
  const [downvoteActive, setDownvoteActive] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);
  const [repostPopupOpen, setRepostPopupOpen] = useState(false);
  const [repostComment, setRepostComment] = useState('');

  const [sharePopupOpen, setSharePopupOpen] = useState(false);

  const [chatrooms, setChatrooms] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
        console.log('✅ Reactions Fetched:', res.data);

        setReactions(res.data);

        // Check if user already reacted
        setLikeActive(res.data.likedUsers.includes(userID));
        setUpvoteActive(res.data.upvotesUsers?.includes(userID));  // Optional, if you track per user
        setDownvoteActive(res.data.downvotesUsers?.includes(userID));  // Optional
      } catch (err) {
        console.error('❌ Error fetching reactions:', err);
      }
    };

    fetchReactions();
  }, [post_id, userID]);

  const toggleLike = async () => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 0, // 0 = Like
        emote_type: null,
        post_id: post_id,
        user_id: userID,
        timestamp: new Date().toISOString(),
      });

      setLikeActive(!likeActive);

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Error adding like reaction:', err);
    }
  };

  const toggleUpvote = async () => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 1, // 1 = Upvote
        emote_type: null,
        post_id: post_id,
        user_id: userID,
        timestamp: new Date().toISOString(),
      });

      setUpvoteActive(!upvoteActive);
      if (downvoteActive) setDownvoteActive(false);

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Error adding upvote reaction:', err);
    }
  };

  const toggleDownvote = async () => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 2, // 2 = Downvote
        emote_type: null,
        post_id: post_id,
        user_id: userID,
        timestamp: new Date().toISOString(),
      });

      setDownvoteActive(!downvoteActive);
      if (upvoteActive) setUpvoteActive(false);

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Error adding downvote reaction:', err);
    }
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const selectEmoji = async (emoji) => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 4,  // 4 = Emoji Reaction
        emote_type: emoji,
        post_id: post_id,
        user_id: userID,
        timestamp: new Date().toISOString(),
      });

      setSelectedEmoji(emoji);
      setEmojiPickerOpen(false);

      const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
      setReactions(res.data);
    } catch (err) {
      console.error('❌ Error adding emoji reaction:', err);
    }
  };

  const toggleRepostPopup = async () => {
    if (!repostPopupOpen) {
      try {
        const res = await axios.get(`http://localhost:3001/api/posts/${post_id}`);
        console.log("✅ Original post fetched:", res.data);
        setOriginalPost(res.data);
      } catch (error) {
        console.error("❌ Error fetching original post:", error);
      }
    }

    setRepostPopupOpen(!repostPopupOpen);
  };

  const handleRepost = () => {
    console.log(`Reposted with comment: ${repostComment}`);
    setRepostPopupOpen(false);

    // fetch('/api/repost', { method: 'POST', body: JSON.stringify({ repostComment, postId: post.id }) });
  };

  const toggleSharePopup = async () => {
    setSharePopupOpen((prev) => !prev);
    
    if (!sharePopupOpen) {
      setLoadingChats(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/chats/all/${userID}`);
        console.log("✅ Chatrooms fetched:", res.data);
        setChatrooms(res.data);
      } catch (error) {
        console.error("❌ Error fetching chatrooms:", error);
      } finally {
        setLoadingChats(false);
      }
    }
  };

  const handleShare = async (chatroomId) => {
    if (!post_id || !chatroomId) {
      alert("Missing post or chatroom ID!");
      return;
    }

    try {
      const messagePayload = {
        chat_id: chatroomId,
        sender_id: userID,
        reply_id: null, // optional, unless it's a reply
        content: `Check out this post! http://localhost:3001/post/${post_id}`,  // or actual post content
        media_type: null, // optional, add if you're sharing media
        media_url: null,   // optional, same as above
        timestamp: new Date().toISOString(),
      };

      const res = await axios.post("http://localhost:3001/api/messages/add", messagePayload);
      console.log("✅ Post shared to chatroom:", res.data);

      alert("Post shared successfully!");
      setSharePopupOpen(false);
    } catch (error) {
      console.error("❌ Error sharing post:", error);
      alert("Failed to share post!");
    }
  };

  return (
    <>
    <ReactionSummaryContainer>
    <ReactionDiv>
      <ReactionItem active={likeActive} onClick={toggleLike}>
        {likeActive ? <BiSolidLike /> : <BiLike />} Like
      </ReactionItem>

      <ReactionItem active={upvoteActive} onClick={toggleUpvote}>
        {upvoteActive ? <BiSolidUpvote /> : <BiUpvote />}
      </ReactionItem>

      <ReactionItem active={downvoteActive} onClick={toggleDownvote}>
        {downvoteActive ? <BiSolidDownvote /> : <BiDownvote />}
      </ReactionItem>

      <ReactionItem onClick={toggleEmojiPicker}>
        <MdOutlineEmojiEmotions /> {selectedEmoji && <SelectedEmoji>{selectedEmoji}</SelectedEmoji>}
      </ReactionItem>

      <EmojiPickerContainer show={emojiPickerOpen}>
        {['😀', '😍', '😂', '😢', '😡', '👍', '👏'].map((emoji) => (
          <EmojiOption key={emoji} onClick={() => selectEmoji(emoji)}>
            {emoji}
          </EmojiOption>
        ))}
      </EmojiPickerContainer>
    </ReactionDiv>

      <ReactionDiv>
        <ReactionItem onClick={onCommentClick}>
          <BiComment /><ReactionNum>Comments</ReactionNum>
        </ReactionItem>
        <ReactionItem onClick={toggleRepostPopup}>
          <BiRepost /><ReactionNum>Repost</ReactionNum>
        </ReactionItem>
        <ReactionItem onClick={toggleSharePopup}>
          <RiShareForwardLine /><ReactionNum>Share</ReactionNum>
        </ReactionItem>
      </ReactionDiv>
    </ReactionSummaryContainer>

    {repostPopupOpen && (
        <>
          <Overlay onClick={toggleRepostPopup} />
          <RepostPopupContainer>
          <UserProfile profileImg={user.profile_picture} userName={user.user_name} variant="default" />
            <CommentInput
              value={repostComment}
              onChange={(e) => setRepostComment(e.target.value)}
              placeholder="Write your thoughts about this post..."
            />
            {originalPost && originalPostUser ? (
              <RepostCard>
                <UserProfile
                  user_id={originalPost.user_id}
                  profileImg={originalPost.profile_picture} // Profile of the original post's author
                  userName={originalPost.userName}
                />
                <p>{originalPost.content}</p>
                {originalPost.images && originalPost.images.length > 0 && (
                  <img src={originalPost.images[0]} alt="Post Preview" width="100%" />
                )}
              </RepostCard>
            ) : (
              <p>Loading post...</p>
            )}
            <ConfirmButton onClick={handleRepost}>Repost</ConfirmButton>
            <CancelButton onClick={toggleRepostPopup}>Cancel</CancelButton>
          </RepostPopupContainer>
        </>
      )}

    {sharePopupOpen && (
      <>
        <Overlay onClick={toggleSharePopup} />
        <SharePopupContainer>
          <h3>Select a Chatroom to Share</h3>

          {loadingChats ? (
            <p>Loading chatrooms...</p>
          ) : chatrooms.length > 0 ? (
          <ChatroomList>
            {chatrooms.map((chatroom) => (
              <ChatroomItem
                key={chatroom.chat_id}
                onClick={() => handleShare(chatroom.chat_id)}
              >
                <ChatroomImage
                  src={chatroom.chat_image && chatroom.chat_image.trim() !== "" ? chatroom.chat_image : "/src/default-chat.png"} // ✅ Check if image is empty
                  alt={chatroom.chat_name}
                />
                {chatroom.chat_name}
              </ChatroomItem>
            ))}
          </ChatroomList>
          ) : (
            <p>No chatrooms available.</p>
          )}

          <CloseButton onClick={toggleSharePopup}>Cancel</CloseButton>
        </SharePopupContainer>
      </>)}
    </>
  );
};


export default Reaction;