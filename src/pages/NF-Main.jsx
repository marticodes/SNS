import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/Full"; 
import styled from "styled-components";
import FeedMain from "../components/NF-NG/FeedMain";
import EditPost from "../components/NF-NG/EditPost";
import NewPost from "../components/NF-NG/NewPost";
import axios from "axios";

const AppContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f0f0f0;
  min-height: 100vh;
  margin-left: 173px;
`;

const NFPage = () => {
  const navigate = useNavigate(); 
  const userID = parseInt(localStorage.getItem("userID"), 10);

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  /*
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
  */

  useEffect(() => {
    if (!userID) {
      alert("User not logged in!");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${userID}`);
        setUserInfo(res.data);
        console.log("✅ User Info:", res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userID, navigate]);


  const fetchFeedData = async () => {
    try {
      const followsRes = await axios.get(`http://localhost:3001/api/relations/all/${userID}/0`);
      const followingIDs = followsRes.data.map((user) => user.user_id);

      const userIdsToFetch = [...followingIDs, userID];
  
      const postsPromises = userIdsToFetch.map((id) =>
        axios.get(`http://localhost:3001/api/posts/all/${id}`).then((res) => res.data)
      );
  
      const postsResults = await Promise.all(postsPromises);
  
      const allPosts = postsResults.flat();
      const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts); // if you're using filtered posts
    } catch (error) {
      console.error("❌ Error fetching feed data:", error);
    }
  };
  
  useEffect(() => {
    if (!userID) return;
    fetchFeedData();
  }, [userID]);

  const addNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    navigate("/case/1");
  };

  const updatePost = (postId, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === postId ? { ...post, ...updatedData } : post
      )
    );
    navigate("/case/1");
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <NavBar caseId={1} />
      </div>
      <AppContainer>
        <Routes>
          <Route
            path="/"
            element={
              <FeedMain
                user={userInfo}
                posts={posts}
                fetchFeedData={fetchFeedData}
              />
            }
          />
          <Route
            path="new-post"
            element={
              <NewPost
                user={userInfo}
                addNewPost={addNewPost}
                fetchFeedData={fetchFeedData}
              />
            }
          />
          <Route
            path="edit-post/:postId"
            element={
              <EditPost
                user={userInfo}
                updatePost={updatePost}
                fetchFeedData={fetchFeedData}
              />
            }
          />
        </Routes>
      </AppContainer>
    </>
  );
};

export default NFPage;