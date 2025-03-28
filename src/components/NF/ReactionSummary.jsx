import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { BiSolidLike, BiUpvote, BiDownvote } from "react-icons/bi";

// Styled Components
const ReactionSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.2rem 0;
  position: relative;
`;

const ReactionDiv = styled.div`
  display: flex;
  gap: 1rem;
`;

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: #555;
  cursor: pointer;
`;

const ReactionNum = styled.span`
  color: #555;
  font-weight: 400;
`;

const LikeSpan = styled.span`
  color: #007bff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SelectedEmoji = styled.span`
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 20;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;

const PopupTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
  color: #007bff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #ddd;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  color: #000000;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const EmojiSpan = styled.span`
  margin-left: auto;
`;


// Component
const ReactionSummary = ({ post_id, likes, votes, comments }) => {
  const [popupOpen, setPopupOpen] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [reactions, setReactions] = useState({
    likedUsers: [],
    emojiReactions: [],
    shares: 0,
    upvotes: 0,
    downvotes: 0,
  });
  const [usersData, setUsersData] = useState({});

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/reactions/posts/${post_id}`);
        setReactions(data);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };
    fetchReactions();
    const interval = setInterval(fetchReactions, 10000);
    return () => clearInterval(interval);
  }, [post_id]);

    useEffect(() => {
      if (!reactions.emojiReactions || reactions.emojiReactions.length === 0) {
        setSelectedEmoji(null);
      } else {
        // Find the emoji with the highest number of users
        const mostFrequent = reactions.emojiReactions.reduce((prev, current) => {
          return (prev.user_id.length > current.user_id.length) ? prev : current;
        });
    
        setSelectedEmoji(mostFrequent.emote_type);
      }
    }, [reactions.emojiReactions]);

    useEffect(() => {
      const fetchUserData = async (userIds) => {
        try {
          const userPromises = userIds.map((userId) =>
            axios.get(`http://localhost:3001/api/user/${userId}`)
          );
          const userResponses = await Promise.all(userPromises);
          const usersMap = userResponses.reduce((acc, res) => {
            acc[res.data.user_id] = res.data;
            return acc;
          }, {});
          setUsersData(usersMap);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
  
      const allUserIds = [
        ...new Set([
          ...reactions.likedUsers,
          ...reactions.emojiReactions.flatMap((reaction) => reaction.user_id),
        ]),
      ];
      fetchUserData(allUserIds);
    }, [reactions]);

  return (
    <ReactionSummaryContainer>
      <ReactionDiv>
        <ReactionItem>
          <LikeSpan onClick={() => setPopupOpen("like")}>
            <BiSolidLike />
          </LikeSpan>
          <span>{reactions.likedUsers.length}</span>
        </ReactionItem>
        <ReactionItem>
          <BiUpvote />
          <span>{reactions.upvotes - reactions.downvotes}</span>
          <BiDownvote />
        </ReactionItem>
        {selectedEmoji && (
          <ReactionItem>
            <SelectedEmoji onClick={() => setPopupOpen("emoji")}>
              {selectedEmoji} +{reactions.emojiReactions.reduce((acc, curr) => acc + curr.user_id.length, 0)}
            </SelectedEmoji>
          </ReactionItem>
        )}
      </ReactionDiv>

      <ReactionDiv>
        <ReactionItem>
          <ReactionNum>{comments}</ReactionNum> comments
        </ReactionItem>
      </ReactionDiv>

      {popupOpen && (
        <PopupContainer>
          <CloseButton onClick={() => setPopupOpen(null)}>&times;</CloseButton>
          {popupOpen === "like" && (
            <>
              <PopupTitle>People who liked this post</PopupTitle>
              <UserList>
                {reactions.likedUsers.map((userId, index) => {
                  const user = usersData[userId];
                  return (
                    <UserItem key={index}>
                      {user ? (
                        <>
                          <ProfileImage src={user.profile_picture} />
                          {user.user_name}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </UserItem>
                  );
                })}
              </UserList>
            </>
          )}
          {popupOpen === "emoji" && (
            <>
              <PopupTitle>Emoji Reactions</PopupTitle>
              <UserList>
                {reactions.emojiReactions.map((reaction, index) => (
                  <div key={index}>
                    <h4>{reaction.emote_type}</h4>
                    {reaction.user_id.map((userId, idx) => {
                      const user = usersData[userId];
                      return (
                        <UserItem key={idx}>
                          {user ? (
                            <>
                              <ProfileImage src={user.profile_picture} />
                              {user.user_name}
                            </>
                          ) : (
                            "Loading..."
                          )}
                        </UserItem>
                      );
                    })}
                  </div>
                ))}
              </UserList>
            </>
          )}
        </PopupContainer>
      )}
    </ReactionSummaryContainer>
  );
};

export default ReactionSummary;