import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FeedSearch from "./FeedSearch";
import Feed from "./Feed";
import NavBar from "../NavBar/Small"

// Styled Components
const FeedContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f4f4f4;
`;

const FeedContent = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewPostDiv = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const NewPostButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0056b3;
  }
`;

const FeedMain = ({ user, posts }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const navigate = useNavigate(); 

  const handleSearch = (result) => {
    if (result.userName) {
      setFilteredPosts(posts.filter((p) => p.userName === result.userName));
    } else if (result.hashtags) {
      setFilteredPosts(
        posts.filter((p) =>
          p.hashtags.some((hashtag) => result.hashtags.includes(hashtag))
        )
      );
    } else if (result.query) {
      setFilteredPosts(
        posts.filter((p) =>
          p.text.toLowerCase().includes(result.query.toLowerCase()) ||
          p.hashtags.some((hashtag) => hashtag.toLowerCase().includes(result.query.toLowerCase()))
        )
      );
    }
  };

  const resetFeed = () => {
    setFilteredPosts(posts);
  };

  const handleNewPost = () => {
    navigate("/case/1/new-post");
  };

  return (
    <FeedContainer>
      <NavBar caseId={1} />
      <FeedContent>
        <FeedSearch posts={posts} users={[user]} onSearch={handleSearch} resetFeed={resetFeed} />
        <NewPostDiv>
          <NewPostButton onClick={handleNewPost}>+ New Post</NewPostButton>
        </NewPostDiv>
        <Feed user={user} posts={filteredPosts} />
      </FeedContent>
    </FeedContainer>
  );
};

export default FeedMain;