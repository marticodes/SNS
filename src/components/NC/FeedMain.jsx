import React, { useState, useEffect, useCallback } from "react";
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
  width: 90%;
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

const FeedMain = ({ user, posts, community_id }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const navigate = useNavigate(); 
  const location = useLocation(); // To detect current route

  // Reset posts when navigating to the home page
  useEffect(() => {
    if (location.pathname === "/case/2") {
      setFilteredPosts(posts); 
    }
  }, [location.pathname, posts]);

    const fetchFeed = useCallback(async (communityId) => {
      if (!communityId) return;
  
      try {
        console.log(`📡 Fetching feed for community ID: ${communityId}`);
        const response = await fetch(`http://localhost:3001/api/recomm/feed/channel/${communityId}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }
        const feedData = await response.json();
        setPosts(feedData);
        console.log("✅ Feed Updated:", feedData);
      } catch (error) {
        console.error("❌ Error fetching feed:", error);
        setPosts([]);
      }
    }, []);

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
    navigate("/case/2/new-post");
    resetFeed();
  };

  return (
    <FeedContainer>
      <FeedContent>
        <FeedSearch onSearch={handleSearch} resetFeed={resetFeed} communityId={community_id}  />
        <NewPostDiv>
          <NewPostButton onClick={handleNewPost}>+ New Post</NewPostButton>
        </NewPostDiv>
        <Feed user={user} postss={filteredPosts} communityId={community_id}/>
      </FeedContent>
    </FeedContainer>
  );
};

export default FeedMain;
