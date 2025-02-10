import React, { useState } from "react";
import styled from "styled-components";
import FeedSearch from "./FeedSearch";
import Feed from "./feed";

// Styled Components
const FeedContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const FeedContent = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavBar = styled.div`
  width: 10%;
  background-color: #7CB9E8;
`

const FeedMain = ({ user, posts }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);

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

  return (
    <FeedContainer>
        <NavBar/>
      <FeedContent>
        <FeedSearch posts={posts} users={[user]} onSearch={handleSearch} resetFeed={resetFeed} />
        <Feed user={user} posts={filteredPosts} />
      </FeedContent>
    </FeedContainer>
  );
};

export default FeedMain;