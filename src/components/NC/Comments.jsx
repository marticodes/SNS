import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import { useParams } from 'react-router-dom';

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
const Comments = ({ post_id = 1, isNested = false }) =>  {
  const { parentId, is_post} = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPostId, setCurrentPostId] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [replyIndex, setReplyIndex] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); 
  let user_id = parseInt(localStorage.getItem("userID"), 10);

  useEffect(() => {
    setCurrentPostId(parentId);
    console.log('here')
    console.log(parentId);

    }, [parentId]);


  useEffect(() => {
    fetchComments();
  }, [post_id]);


  const fetchComments = async () => {
    try {
      console.log()
      const res = await axios.get(`http://localhost:3001/api/comments/all/${post_id}/1`); // parent_id = 0 or null for top-level comments
      console.log("✅ Comments fetched:", res.data);

      //CAN YOU CHECK THIS API HERE ON TOP? IS IT WRONG?? SHOULD 1 GO BEFORE POST_ID?
      
      const commentsWithUserData = await Promise.all(
        res.data.map(async (comment) => {
          try {
            const userRes = await axios.get(`http://localhost:3001/api/user/${comment.user_id}`);
            return { 
              ...comment, 
              userName: userRes.data.user_name, 
              profileImg: userRes.data.profile_picture || "/default-profile.png" 
            };
          } catch (error) {
            console.error(`❌ Error fetching user data for user_id ${comment.user_id}:`, error);
            return { 
              ...comment, 
              userName: "Unknown User", 
              profileImg: "/default-profile.png" 
            };
          }
        })
      );
      
      const nested = buildNestedComments(commentsWithUserData);
      setComments(nested);
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  const buildNestedComments = (comments) => {
    console.log("🚀 Raw comments before nesting:", comments);

    const commentMap = {};
    const nestedComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;
    });

    comments.forEach(comment => {
      if (comment.post == 0) {
        commentMap[comment.parent_id].replies.push(comment);
      } else {
        nestedComments.push(comment);
      }
    });

    console.log("✅ Nested comments:", nestedComments);
    return nestedComments;
};


  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const payload = {
        parent_id: post_id,
        user_id: user_id,
        content: newComment,
        media_type: mediaFiles.length > 0 ? 1 : 0,
        media_url: null,
        timestamp: new Date().toISOString(),
        visibility: 1,
        post: 1
      };

      await axios.post('http://localhost:3001/api/post/comment/add', payload);
      console.log('✅ Comment added');

      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    if (!newReply.trim()) return;

    try {
      const payload = {
        parent_id: parentCommentId,
        user_id: user_id,
        content: newReply,
        media_type: null,
        media_url: null,
        timestamp: new Date().toISOString(),
        visibility: 1,
        post: 0
      };

      await axios.post('http://localhost:3001/api/post/comment/add', payload);
      console.log('✅ Reply added');

      fetchComments();
      setNewReply('');
      setReplyIndex(null);
    } catch (error) {
      console.error("❌ Error adding reply:", error);
    }
  };

  const fetchReplies = async (parentId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/comments/all/${parentId}/${post_id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching replies:", error);
      return [];
    }
  };

  const handleReplyButtonClick = async (index, commentId) => {
    if (replyIndex === index) {
      setReplyIndex(null); // close reply input
    } else {
      const updatedComments = [...comments];
      const replies = await fetchReplies(commentId);
      updatedComments[index].replies = replies;
      setComments(updatedComments);
      setReplyIndex(index);
    }
  };

  return (
    <CommentsSection>
      {/* New Comment */}
      <UserComment>
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <SendButton onClick={handleAddComment}>Send</SendButton>
      </UserComment>

      {/* Comments */}
      <div>
        {comments.map((comment, index) => (
        <CommentItem key={comment.comment_id}>
        <CommentContent>
          <ProfileImage src={comment.profileImg} alt={comment.userName} />
          <TextContent>
            <p>{comment.userName}</p>
            <p>{comment.content}</p>
            {isNested && (
              <ReplyButton onClick={() => setReplyIndex(comment.comment_id)}>
                Reply
              </ReplyButton>
              
            )}
          </TextContent>
        </CommentContent>

            {/* Reply input */}
            {isNested && replyIndex == comment.comment_id && (
              <UserComment>
                {/* <ProfileImage src={comment.profileImg} alt={`${comment.userName}'s profile`} /> */}
                <TextArea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Write a reply..."
                />
                <SendButton onClick={() => handleAddReply(comment.comment_id)}>Send</SendButton>
              </UserComment>
            )}

            {/* Replies */}
            {isNested && comment.replies && comment.replies.length > 0 && (
              <RepliesList>
                {comment.replies.map((reply, idx) => (
                  <CommentItem key={reply.comment_id || idx}>
                    <CommentContent>
                      <ProfileImage src={reply.profile_picture || "/default-profile.png"} alt={reply.user_name} />
                      <TextContent>
                        <p>{reply.user_name}</p>
                        <p>{reply.content}</p>
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