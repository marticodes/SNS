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
const Reaction = ({ user_id, post_id, onCommentClick }) => {

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
  const [originalPostUser, setOriginalPostUser] = useState(null);
  const [repostPopupOpen, setRepostPopupOpen] = useState(false);
  const [repostComment, setRepostComment] = useState('');

  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const userID = parseInt(localStorage.getItem("userID"), 10);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${userID}`);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Error fetching logged-in user:", error);
      }
    };

    fetchUser();
  }, [userID]);

  // Fetch reactions for post
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
        console.log('✅ Reactions fetched:', res.data);

        setReactions(res.data || {});
        setLikeActive(res.data?.likedUsers?.includes(user_id));
        setUpvoteActive(res.data?.upvotesUsers?.includes(user_id));
        setDownvoteActive(res.data?.downvotesUsers?.includes(user_id));
      } catch (err) {
        console.error('❌ Error fetching reactions:', err);
      }
    };

    fetchReactions();
  }, [post_id, user_id]);

  // LIKE reaction
  const toggleLike = async () => {
    try {
      const timestamp = new Date().toISOString();

      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 0,
        emote_type: null,
        post_id,
        user_id,
        timestamp: new Date().toISOString(),
      });

      console.log("✅ Like reaction added");
      setLikeActive(!likeActive);
    } catch (err) {
      console.error("❌ Error adding like reaction:", err);
    }
  };

  // UPVOTE reaction
  const toggleUpvote = async () => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 1,
        emote_type: null,
        post_id,
        user_id,
        timestamp: new Date().toISOString(),
      });

      setUpvoteActive(!upvoteActive);
      setDownvoteActive(false);
    } catch (err) {
      console.error('❌ Error adding upvote reaction:', err);
    }
  };

  // DOWNVOTE reaction
  const toggleDownvote = async () => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 2,
        emote_type: null,
        post_id,
        user_id,
        timestamp: new Date().toISOString(),
      });

      setDownvoteActive(!downvoteActive);
      setUpvoteActive(false);
    } catch (err) {
      console.error('❌ Error adding downvote reaction:', err);
    }
  };

  // EMOJI picker toggle
  const toggleEmojiPicker = () => {
    setEmojiPickerOpen(prev => !prev);
  };

  // EMOJI select
  const selectEmoji = async (emoji) => {
    try {
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 4,
        emote_type: emoji,
        post_id,
        user_id,
        timestamp: new Date().toISOString(),
      });

      setSelectedEmoji(emoji);
      setEmojiPickerOpen(false);
    } catch (err) {
      console.error('❌ Error adding emoji reaction:', err);
    }
  };

  // REPOST logic
  const toggleRepostPopup = async () => {
    if (!repostPopupOpen) {
      try {
        const postRes = await axios.get(`http://localhost:3001/api/posts/id/${post_id}`);
        const post = postRes.data;
  
        setOriginalPost(post);
  
        const userRes = await axios.get(`http://localhost:3001/api/user/${post.user_id}`);
        setOriginalPostUser(userRes.data);
      } catch (error) {
        console.error("❌ Error fetching repost data:", error);
      }
    }
  
    setRepostPopupOpen(!repostPopupOpen);
  };

  const handleRepost = () => {
    console.log(`Reposting with comment: ${repostComment}`);
    setRepostPopupOpen(false);

    // TODO: Implement backend repost API here
  };

  // SHARE logic
  /*
  const toggleSharePopup = async () => {
    if (!sharePopupOpen) {
      setLoadingChats(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/chats/all/${user_id}`);
        setChatrooms(res.data);
        console.log("✅ Chatrooms fetched:", res.data);
      } catch (err) {
        console.error('❌ Error fetching chatrooms:', err);
      } finally {
        setLoadingChats(false);
      }
    }

    setSharePopupOpen(prev => !prev);
  };
  */

  const handleShare = async (chatroomId) => {
    try {
      const timestamp = new Date().toISOString();

      await axios.post(`http://localhost:3001/api/messages/add`, {
        chat_id: chatroomId,
        sender_id: user_id,
        reply_id: null,
        content: `Check out this post! http://localhost:3001/post/${post_id}`,
        media_type: null,
        media_url: null,
        timestamp,
      });

      alert("✅ Post shared to chatroom!");
      setSharePopupOpen(false);
    } catch (err) {
      console.error('❌ Error sharing post:', err);
      alert('❌ Failed to share post');
    }
  };

  return (
    <>
      <ReactionSummaryContainer>
        <ReactionDiv>
          <ReactionItem onClick={toggleLike}>
            {likeActive ? <BiSolidLike /> : <BiLike />} Like
          </ReactionItem>
          <ReactionItem onClick={toggleUpvote}>
            {upvoteActive ? <BiSolidUpvote /> : <BiUpvote />} Upvote
          </ReactionItem>
          <ReactionItem onClick={toggleDownvote}>
            {downvoteActive ? <BiSolidDownvote /> : <BiDownvote />} Downvote
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
            <BiComment /> Comments
          </ReactionItem>
          <ReactionItem onClick={toggleRepostPopup}>
            <BiRepost /> Repost
          </ReactionItem>
        </ReactionDiv>
      </ReactionSummaryContainer>

      {/* REPOST POPUP */}
      {repostPopupOpen && (
        <>
          <Overlay onClick={toggleRepostPopup} />
          <RepostPopupContainer>
            <UserProfile profileImg={user?.profile_picture} userName={user?.user_name} variant="default" />

            <CommentInput
              value={repostComment}
              onChange={(e) => setRepostComment(e.target.value)}
              placeholder="Write your thoughts about this post..."
            />

            {originalPost && originalPostUser ? (
              <RepostCard>
                <UserProfile
                  profileImg={originalPostUser.profile_picture}
                  userName={originalPostUser.user_name}
                />
                <RepostContent>{originalPost.content}</RepostContent>
              </RepostCard>
            ) : (
              <p>Loading post...</p>
            )}

            <ConfirmButton onClick={handleRepost}>Repost</ConfirmButton>
            <CancelButton onClick={toggleRepostPopup}>Cancel</CancelButton>
          </RepostPopupContainer>
        </>
      )}

      {/* SHARE POPUP */}
      {sharePopupOpen && (
        <>
          <Overlay onClick={toggleSharePopup} />
          <SharePopupContainer>
            <h3>Select a Chatroom to Share</h3>
            {loadingChats ? (
              <p>Loading chatrooms...</p>
            ) : chatrooms.length > 0 ? (
              <ChatroomList>
                {chatrooms.map((chat) => (
                  <ChatroomItem key={chat.chat_id} onClick={() => handleShare(chat.chat_id)}>
                    <ChatroomImage
                      src={chat.chat_image?.trim() ? chat.chat_image : '/src/default-chat.png'}
                      alt={chat.chat_name}
                    />
                    {chat.chat_name}
                  </ChatroomItem>
                ))}
              </ChatroomList>
            ) : (
              <p>No chatrooms available.</p>
            )}
            <CloseButton onClick={toggleSharePopup}>Cancel</CloseButton>
          </SharePopupContainer>
        </>
      )}
    </>
  );
};

export default Reaction;