import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Post from "./Post";

// Styled Components
const FeedDiv = styled.div`
  width: 60%;
  height: auto;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Feed = ({ posts = [], user, commentType = "nested" }) => {

  return (
    <>
      {posts.length === 0 ? (
        <p>No results found.</p>
      ) : (
        posts.map((post) => (
          <FeedDiv key={post.post_id}>
            <Post post={post} user={user} commentType={commentType} />
          </FeedDiv>
        ))
      )}
    </>
  );
};

export default Feed;