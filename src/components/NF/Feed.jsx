import React, { useEffect, useState } from "react";
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
  text-align: left;
`;

const Feed = ({ postss, user, commentType = "nested", isProfilePage = false }) => {
  const [posts, setPosts] = useState(postss);
  const [activeHashtag, setActiveHashtag] = useState(null);
  const searchedWord = localStorage.getItem("SearchedWord");

  useEffect(() => {
    setPosts(postss);
  }, [postss]);

  const hashtagClick = async (hashtag) => {
    try {
      const response = await fetch(`http://localhost:3001/api/hashtags/post/${hashtag}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts for hashtag");
      }
      const fetchedPosts = await response.json();
      setPosts(fetchedPosts);
      setActiveHashtag(hashtag); // Set the active hashtag
    } catch (error) {
      console.error("Error fetching posts for hashtag:", error);
    }
  };

  const clearHashtag = () => {
    setActiveHashtag(null); // Reset the active hashtag
    setPosts(postss); // Revert to the original posts
  };

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
      {/* Show the active hashtag with an "X" to clear it */}
      {activeHashtag && (
        <div style={{ textAlign: "center", marginTop: "1px"}}>
          <button style={{ color: "white", backgroundColor: "#7cb0e8"}} onClick={clearHashtag}>
            #{activeHashtag}<span style={{ color: "white", marginLeft: "10px" }}>X</span>
          </button>
        </div>
      )}

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
            <Post
              post={post}
              user={user}
              commentType={commentType}
              hashtagClick={hashtagClick}
            />
          </FeedDiv>
        ))
      )}
    </>
  );
};

export default Feed;