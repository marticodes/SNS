import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/Full"; 
import styled from "styled-components";
import FeedMain from "../components/NF-NG/FeedMain";
import EditPost from "../components/NF-NG/EditPost";
import NewPost from "../components/NF-NG/NewPost";

const AppContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const NFPage = () => {
  const navigate = useNavigate(); 

  const userInfo = {
    user_name: "Jane Doe",
    profile_picture: "./src/dummy-profile-img.jpg",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      profileImg: "./src/dummy-profile-img.jpg",
      userName: "Jane Doe",
      postDate: "2025-01-21",
      text: "This is a sample feed post with images.",
      hashtags: ["nature", "photo"],
      images: [
        "../src/dummy-feed-img-1.jpg",
        "../src/dummy-feed-img-2.jpg",
        "../src/dummy-feed-img-3.jpg",
      ],
      reactions: {
        likedUsers: [
          { profileImg: "./src/dummy-profile-img-2.jpg", userName: "John Smith" },
          { profileImg: "./src/dummy-profile-img-4.jpeg", userName: "Alice Brown" },
        ],
        emojiReactions: [
          { profileImg: "./src/dummy-profile-img-3.jpg", userName: "Bob Smith", emoji: "😂" },
          { profileImg: "./src/dummy-profile-img-4.jpeg", userName: "Charlie Lee", emoji: "❤️" },
        ],
        upvotedUsers: 10,
        downvotedUsers: 2,
        shares: 3,
      },
      comments: [
        {
          id: 101,
          profileImg: "./src/dummy-profile-img-2.jpg",
          userName: "John Smith",
          text: "Awesome post!",
          replies: [
            {
              id: 201,
              profileImg: "./src/dummy-profile-img-4.jpeg",
              userName: "Alice Brown",
              text: "Agreed!",
            },
          ],
        },
        {
          id: 102,
          profileImg: "./src/dummy-profile-img-4.jpeg",
          userName: "Alice Brown",
          text: "Really nice!",
          replies: [],
        },
      ],
    },
    {
      id: 2,
      profileImg: "./src/dummy-profile-img-2.jpg",
      userName: "John Smith",
      postDate: "2025-01-21",
      text: "This is a sample feed post with text only.",
      images: [],
      hashtags: ["example"],
      reactions: {
        likedUsers: [{ profileImg: "./src/dummy-profile-img-2.jpg", userName: "John Smith" }],
        emojiReactions: [
          { profileImg: "./src/dummy-profile-img-3.jpg", userName: "Bob Smith", emoji: "😂" },
          { profileImg: "./src/dummy-profile-img-4.jpeg", userName: "Charlie Lee", emoji: "❤️" },
        ],
        upvotedUsers: 4,
        downvotedUsers: 1,
        shares: 2,
      },
      comments: [
        {
          id: 103,
          profileImg: "./src/dummy-profile-img-2.jpg",
          userName: "John Smith",
          text: "Awesome post!",
          replies: [
            {
              id: 202,
              profileImg: "./src/dummy-profile-img-4.jpeg",
              userName: "Alice Brown",
              text: "Agreed!",
            },
          ],
        },
        {
          id: 104,
          profileImg: "./src/dummy-profile-img-4.jpeg",
          userName: "Alice Brown",
          text: "Really nice!",
          replies: [],
        },
      ],
    },
  ]);

  const addNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    navigate("/case/1");
  };

  const updatePost = (postId, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...updatedData } : post
      )
    );
    navigate("/case/1");
  };

  return (

    <AppContainer>
      <Routes>
        <Route path="/" element={<FeedMain user={userInfo} posts={posts} />} />
        <Route path="new-post" element={<NewPost user={userInfo} addNewPost={addNewPost} />} />
        <Route path="edit-post/:postId" element={<EditPost user={userInfo} posts={posts} updatePost={updatePost} />} />
      </Routes>
    </AppContainer>
  );
};

export default NFPage;