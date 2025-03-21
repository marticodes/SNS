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

const Feed = ({ posts, user, commentType = "nested" }) => {

  const searchedWord = localStorage.getItem("SearchedWord");
  console.log("Searched Word:", searchedWord);


  return (
    <>
      {posts.length === 0 ? (
        searchedWord ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 style={{ color: "black", fontSize: "20px" }}>
              Hm...we couldn’t find any results for "{searchedWord}".
            </h1>
            <p style={{ color: "black", fontSize: "14px" }}>
              Double-check your spelling or try different keywords.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 style={{ color: "black", fontSize: "20px" }}>
              Oops, it seems like there is no post for you!
            </h1>
            <p style={{ color: "black", fontSize: "14px" }}>
              Try adding more friends or making a search!
            </p>
          </div>
        )
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