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
  position: relative;
`

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #555;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: 100%; 
  left: -10px;
  margin-top: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 5px 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.show ? 'flex' : 'none')};
  z-index: 1000;
`;

const EmojiOption = styled.span`
  font-size: 1.0rem;
  cursor: pointer;
  margin: 5px;

  &:hover {
    transform: scale(1.2);
  }
`;

const SelectedEmoji = styled.span`
  font-size: 1.0rem;
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
  width: 70%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  z-index: 100000000;
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
  width: 90%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  color: #000000;
  background: #f0f8ff;
  margin: 10px auto;
  margin-bottom: 20px;
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
const Reaction = ({ user_id, post_id, onCommentClick, communityId }) => {
  const [reactions, setReactions] = useState({
    likedUsers: [],
    emojiReactions: [],
    upvotes: 0,
    downvotes: 0,
    shares: 0
  });

  const [levelTwoFeatures, setLevelTwoFeatures] = useState(null);
  const myUserID = parseInt(localStorage.getItem("userID"), 10);

  const [likeActive, setLikeActive] = useState(false);
  const [upvoteActive, setUpvoteActive] = useState(false);
  const [downvoteActive, setDownvoteActive] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);
  const [originalPostUser, setOriginalPostUser] = useState(null);
  const [repostPopupOpen, setRepostPopupOpen] = useState(false);
  const [repostComment, setRepostComment] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch level two features
  useEffect(() => {
    const fetchLevelTwoFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/features/lvl/two/');
        setLevelTwoFeatures(response.data);
      } catch (error) {
        console.error('Error fetching level two features:', error);
      }
    };

    fetchLevelTwoFeatures();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${myUserID}`);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Error fetching logged-in user:", error);
      }
    };

    fetchUser();
  }, [myUserID]);

  // Fetch reactions for post

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);

        setReactions(res.data || {});
      } catch (err) {
        console.error('❌ Error fetching reactions:', err);
      }
    };

    fetchReactions();
  }, [post_id, user_id]);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/reactions/posts/user/${myUserID}/${post_id}`);
        const reactions = res.data || [];

        setLikeActive(reactions.some(reaction => reaction.reaction_type === 0));
        setUpvoteActive(reactions.some(reaction => reaction.reaction_type === 1));
        setDownvoteActive(reactions.some(reaction => reaction.reaction_type === 2));
  
        const emojiReaction = reactions.find(reaction => reaction.reaction_type === 4);
        setSelectedEmoji(emojiReaction?.emote_type || null);
      } catch (err) {
        console.error('❌ Error fetching reactions:', err);
      }
    };
  
    fetchReactions();
  }, [myUserID, post_id]);  

  // LIKE reaction
  const toggleLike = async () => {
    try {
      if (likeActive) {
        // Remove the like
        await axios.delete(`http://localhost:3001/api/reactions/delete`, {
          data: {
            reaction_type: 0,
            post_id,
            user_id: myUserID,
          },
        });
  
        console.log("❌ Like reaction removed");
      } else {
        // Add the like
        await axios.post(`http://localhost:3001/api/reactions/post/add`, {
          reaction_type: 0,
          emote_type: null,
          post_id,
          user_id: myUserID,
          timestamp: new Date().toISOString(),
        });
  
        console.log("✅ Like reaction added");
      }
  
      // Toggle the state
      setLikeActive(!likeActive);
    } catch (err) {
      console.error("❌ Error toggling like reaction:", err);
    }
  };  

  // UPVOTE reaction
  const toggleUpvote = async () => {
    try {
      if (upvoteActive) {
        // Remove the upvote
        await axios.delete(`http://localhost:3001/api/reactions/delete`, {
          data: {
            reaction_type: 1,
            post_id,
            user_id: myUserID,
          },
        });

        console.log("❌ Upvote reaction removed");
      } else {
        // Add the upvote
        await axios.post(`http://localhost:3001/api/reactions/post/add`, {
          reaction_type: 1,
          emote_type: null,
          post_id,
          user_id: myUserID,
          timestamp: new Date().toISOString(),
        });

        console.log("✅ Upvote reaction added");
      }

      // Toggle the states
      setUpvoteActive(!upvoteActive);
      setDownvoteActive(false);
    } catch (err) {
      console.error("❌ Error toggling upvote reaction:", err);
    }
  };

  // DOWNVOTE reaction
  const toggleDownvote = async () => {
    try {
      if (downvoteActive) {
        // Remove the downvote
        await axios.delete(`http://localhost:3001/api/reactions/delete`, {
          data: {
            reaction_type: 2,
            post_id,
            user_id: myUserID,
          },
        });

        console.log("❌ Downvote reaction removed");
      } else {
        // Add the downvote
        await axios.post(`http://localhost:3001/api/reactions/post/add`, {
          reaction_type: 2,
          emote_type: null,
          post_id,
          user_id: myUserID,
          timestamp: new Date().toISOString(),
        });

        console.log("✅ Downvote reaction added");
      }

      // Toggle the states
      setDownvoteActive(!downvoteActive);
      setUpvoteActive(false);
    } catch (err) {
      console.error("❌ Error toggling downvote reaction:", err);
    }
  };

  // EMOJI picker toggle
  const toggleEmojiPicker = () => {
    setEmojiPickerOpen(prev => !prev);
  };

  // EMOJI select
  const addEmoji = async (emoji) => {
    try {
      // Add the emoji reaction
      await axios.post(`http://localhost:3001/api/reactions/post/add`, {
        reaction_type: 4,
        emote_type: emoji,
        post_id,
        user_id: myUserID,
        timestamp: new Date().toISOString(),
      });

      console.log("✅ Emoji reaction added");
      setSelectedEmoji(emoji); // Set the selected emoji
      setEmojiPickerOpen(false); // Close the emoji picker
    } catch (err) {
      console.error("❌ Error adding emoji reaction:", err);
    }
  };

  const deleteEmoji = async () => {
    try {
      if (selectedEmoji) {
        // Remove the emoji reaction
        await axios.delete(`http://localhost:3001/api/reactions/delete`, {
          data: {
            reaction_type: 4,
            post_id,
            user_id: myUserID,
          },
        });

        console.log("❌ Emoji reaction removed");
        setSelectedEmoji(null); // Clear the selected emoji
        setEmojiPickerOpen(false); // Close the emoji picker
      }
    } catch (err) {
      console.error("❌ Error deleting emoji reaction:", err);
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

  const handleRepost = async () => {
    console.log(`Reposting with comment: ${repostComment}`);

    const newPostData = {
      parent_id: post_id, // parent_id should be the id of the post being reposted
      user_id: myUserID,
      content: repostComment,
      timestamp: new Date().toISOString(),
      media_type: 0, 
      duration: 0, // Assuming non-ephemeral posts
      visibility: 2, // Assuming visibility is public
      comm_id: communityId,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/post/add", newPostData);
      setShowSuccessPopup(true);
  
      // Hide the success popup after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        setRepostPopupOpen(false); // Close the repost popup after success
      }, 2000);
      } catch (error) {
        console.error("❌ Error reposting:", error.message);
      };
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
          {/* Show Like button only if reactions is 1 */}
          {levelTwoFeatures?.reactions === 1 && (
            <ReactionItem onClick={toggleLike} style={{ color: likeActive ? 'blue' : 'black' }}>
              {likeActive ? <BiSolidLike /> : <BiLike />} Like
            </ReactionItem>
          )}

          {/* Show Upvote/Downvote buttons only if reactions is 2 */}
          {levelTwoFeatures?.reactions === 2 && (
            <>
              <ReactionItem onClick={toggleUpvote} style={{ color: upvoteActive ? 'blue' : 'black' }}>
                {upvoteActive ? <BiSolidUpvote /> : <BiUpvote />} Upvote
              </ReactionItem>
              <ReactionItem onClick={toggleDownvote} style={{ color: downvoteActive ? 'blue' : 'black' }}>
                {downvoteActive ? <BiSolidDownvote /> : <BiDownvote />} Downvote
              </ReactionItem>
            </>
          )}

          {/* Show Emoji reactions only if reactions is 3 */}
          {levelTwoFeatures?.reactions === 3 && (
            <>
              <ReactionItem onClick={toggleEmojiPicker}>
                <MdOutlineEmojiEmotions style={{ fontSize: '1.3rem' }} />
              </ReactionItem>
              {selectedEmoji && <SelectedEmoji onClick={deleteEmoji}>{selectedEmoji}</SelectedEmoji>}

              <EmojiPickerContainer show={emojiPickerOpen}>
                {['😀', '😍', '😂', '😢', '😡', '👍', '👏'].map((emoji) => (
                  <EmojiOption key={emoji} onClick={() => addEmoji(emoji)}>
                    {emoji}
                  </EmojiOption>
                ))}
              </EmojiPickerContainer>
            </>
          )}
        </ReactionDiv>

        <ReactionDiv>
          <ReactionItem onClick={onCommentClick}>
            <BiComment /> Comments
          </ReactionItem>
        </ReactionDiv>
      </ReactionSummaryContainer>

      {/* REPOST POPUP */}
      {repostPopupOpen && (
        <>
        {showSuccessPopup && (
          <SuccessPopup>Successfully uploaded!</SuccessPopup>
        )}
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

// Success Popup Style
const SuccessPopup = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: green;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  z-index: 10000;
`;

export default Reaction;