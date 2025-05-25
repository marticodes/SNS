import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
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
  margin-top: 1rem;
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
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const navigate = useNavigate(); 
  const location = useLocation(); // To detect current route

  // Reset posts when navigating to the home page
  useEffect(() => {
    if (location.pathname === "/case/1") {
      setFilteredPosts(posts); 
    }
  }, [location.pathname, posts]);

  const handleSearch = async (searchQuery) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/combined/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const searchedPosts = await response.json();

      console.log("Searched posts from API:", searchedPosts);

      setFilteredPosts(searchedPosts);
    } catch (error) {
      console.error("Error fetching searched posts:", error);
    }
  };

  const resetFeed = () => {
    setFilteredPosts(posts); // Reset to original posts
  };

  const handleNewPost = () => {
    navigate("/case/1/new-post");
    resetFeed();
  };

  return (
    <FeedContainer>
      <FeedContent>
        <FeedSearch onSearch={handleSearch} resetFeed={resetFeed} />
        <NewPostDiv>
          <NewPostButton onClick={handleNewPost}>+ New Post</NewPostButton>
        </NewPostDiv>
        <Feed user={user} postss={filteredPosts} />
      </FeedContent>
    </FeedContainer>
  );
};

export default FeedMain;
