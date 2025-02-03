import React, { useState } from 'react';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import { RiShareForwardLine } from "react-icons/ri";
import { BiLike, BiSolidLike, BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote, BiComment, BiRepost } from 'react-icons/bi';
import { MdOutlineEmojiEmotions } from "react-icons/md";

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
const Reaction = ({ userProfile, userName, originalPost, onLike, onUpvote, onDownvote, onEmojiSelect, onCommentClick }) => {
  const [likeActive, setLikeActive] = useState(false);
  const [upvoteActive, setUpvoteActive] = useState(false);
  const [downvoteActive, setDownvoteActive] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [repostPopupOpen, setRepostPopupOpen] = useState(false);
  const [repostComment, setRepostComment] = useState('');
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [chatrooms, setChatrooms] = useState([
    { id: 1, name: 'Chatroom1', profileImg: '../src/dummy-profile-img-4.jpeg' },
    { id: 2, name: 'Chatroom2', profileImg: '../src/dummy-profile-img-4.jpeg'},
    { id: 3, name: 'Chatroom3', profileImg: '../src/dummy-profile-img-4.jpeg'},
    { id: 4, name: 'Chatroom4', profileImg: '../src/dummy-profile-img-4.jpeg'}
  ]);

  const toggleLike = () => {
    setLikeActive(!likeActive);
    onLike(!likeActive); // Notify parent component of the change
  };

  const toggleUpvote = () => {
    if (downvoteActive) setDownvoteActive(false); // Cancel downvote if active
    setUpvoteActive(!upvoteActive);
    onUpvote(!upvoteActive);
  };

  const toggleDownvote = () => {
    if (upvoteActive) setUpvoteActive(false); // Cancel upvote if active
    setDownvoteActive(!downvoteActive);
    onDownvote(!downvoteActive);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const selectEmoji = (emoji) => {
    onEmojiSelect(emoji);
    setEmojiPickerOpen(false); // Close picker after selection
  };

  const toggleRepostPopup = () => {
    setRepostPopupOpen((prev) => !prev);
  };

  const handleRepost = () => {
    console.log(`Reposted with comment: ${repostComment}`);
    setRepostPopupOpen(false);

    // fetch('/api/repost', { method: 'POST', body: JSON.stringify({ repostComment, postId: post.id }) });
  };

  const toggleSharePopup = () => {
    setSharePopupOpen((prev) => !prev);
  };

  const handleShare = (chatroomId) => {
    console.log(`Post shared to chatroom ID: ${chatroomId}`);
    setSharePopupOpen(false);
    // fetch('/api/share', { method: 'POST', body: JSON.stringify({ chatroomId }) });
  };

  return (
    <>
    <ReactionSummaryContainer>
      <ReactionDiv>
        <ReactionItem active={likeActive} onClick={toggleLike}>
          {likeActive ? <BiSolidLike /> : <BiLike />}Like
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
          <UserProfile profileImg={userProfile} userName={userName} />
            <CommentInput
              value={repostComment}
              onChange={(e) => setRepostComment(e.target.value)}
              placeholder="Write a post..."
            />
            {originalPost && originalPost.text ? (
              <RepostCard>
                <UserProfile
                  profileImg={originalPost.profileImg} // Profile of the original post's author
                  userName={originalPost.userName}
                />
                <p>{originalPost.text}</p>
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
          <ChatroomList>
            {chatrooms.map((chatroom) => (
              <ChatroomItem key={chatroom.id} onClick={() => handleShare(chatroom.id)}>
                <ChatroomImage src={chatroom.profileImg} alt={chatroom.name} />
                {chatroom.name}
              </ChatroomItem>
            ))}
          </ChatroomList>
          <CloseButton onClick={toggleSharePopup}>Cancel</CloseButton>
        </SharePopupContainer>
      </>
    )}
    </>
  );
};

export default Reaction;