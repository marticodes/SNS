import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const CommentsSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const UserComment = styled.div`
  display: flex;
  gap: 1rem;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;
  color: #000000;
  background-color: #FFFFFF;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SendButton = styled.button`
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentContent = styled.div`
  display: flex;
  gap: 10px;
  color: #000000;

  p {
    margin: 0 0 5px 0;
  }

  span {
    font-size: 0.9rem;
    color: #555;
  }
`;


const TextContent = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  flex: 1;

  p {
    margin: 0 0 5px 0;
  }

  span {
    font-size: 0.9rem;
    color: #555;
  }
`;

const ReplyButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    text-decoration: underline;
  }
  &:active{
    border: none;
  }
`;

const RepliesList = styled.div`
  margin-left: 2rem;
  margin-top: 0.5rem;

  ${CommentItem} {
    margin-bottom: 0.5rem;
  }
`;

// Component
const Comments = ({ profileImg, userName, initialComments = [], isNested = false }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState(''); // Track reply input
  const [replyIndex, setReplyIndex] = useState(null); // Track which comment is being replied to

  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { profileImg, userName, text: newComment, replies: [] },
      ]);
      setNewComment('');
    }
  };

  const addReply = (index) => {
    if (newReply.trim()) {
      setComments(
        comments.map((comment, i) =>
          i === index
            ? {
                ...comment,
                replies: [...comment.replies, { profileImg, userName, text: newReply }],
              }
            : comment
        )
      );
      setNewReply(''); // Clear the reply input
      setReplyIndex(null); // Close the reply input section
    }
  };

  return (
    <CommentsSection>
      <UserComment>
        <ProfileImage src={profileImg} alt={`${userName}'s profile`} />
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <SendButton onClick={addComment}>Send</SendButton>
      </UserComment>
            <div>
        {comments.map((comment, index) => (
          <CommentItem key={index}>
            {/* Comment Content */}
            <CommentContent>
              <ProfileImage src={comment.profileImg} alt={comment.userName} />
              <TextContent>
                <p>
                {comment.userName}
                </p>
                <p>{comment.text}</p>
                {isNested && (
                  <ReplyButton onClick={() => setReplyIndex(index)}>Reply</ReplyButton>
                )}
              </TextContent>
            </CommentContent>

            {/* Reply Input */}
            {isNested && replyIndex === index && (
              <UserComment>
                <ProfileImage src={profileImg} alt={`${userName}'s profile`} />
                <TextArea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Write a reply..."
                />
                <SendButton onClick={() => addReply(index)}>Send</SendButton>
              </UserComment>
            )}

            {/* Replies */}
            {isNested && comment.replies.length > 0 && (
              <RepliesList>
                {comment.replies.map((reply, idx) => (
                  <CommentItem key={idx}>
                    <CommentContent>
                      <ProfileImage src={reply.profileImg} alt={reply.userName} />
                      <TextContent>
                        <p>
                        {reply.userName}
                        </p>
                        <p>{reply.text}</p>
                      </TextContent>
                    </CommentContent>
                  </CommentItem>
                ))}
              </RepliesList>
            )}
          </CommentItem>
        ))}
      </div>
    </CommentsSection>
  );
};

export default Comments;