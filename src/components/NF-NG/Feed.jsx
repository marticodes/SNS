import React, { useEffect } from "react";
import styled from "styled-components";
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

const Feed = ({ posts, user, commentType = "nested", isProfilePage = false }) => {
  const searchedWord = localStorage.getItem("SearchedWord");

  useEffect(() => {
    if (isProfilePage) {
      localStorage.removeItem("SearchedWord");
      console.log("Cleared SearchedWord from localStorage for profile page");
    }
  }, [isProfilePage]);

  const noPostsMessage = isProfilePage ? (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ color: "black", fontSize: "20px" }}>
        No posts in your profile yet!
      </h1>
      <p style={{ color: "black", fontSize: "14px" }}>
        Try creating your first post to share something with your friends.
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
  );

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
          noPostsMessage
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