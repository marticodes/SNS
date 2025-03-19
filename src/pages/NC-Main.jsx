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
  //const userID = 1; // REMOVE THIS LINE

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const fetchFeed = async (userId, feedType) => {
    const baseUrl = "http://localhost:3001/api/recomm/feed";
    let endpoint;
  
    switch (feedType) {
      case 1:
        endpoint = `${baseUrl}/friends/${userId}`;
        break;
      case 2:
        endpoint = `${baseUrl}/interests/${userId}`;
        break;
      case 3:
        endpoint = `${baseUrl}/combined/${userId}`;
        break;
      default:
        throw new Error("Invalid feed type. Use 1 for friends, 2 for interests, or 3 for combined.");
    }
  
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error("Error fetching feed:", error);
      return { error: error.message };
    }
  };  

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

  const fetchFeedData = async (feedType = 1) => {
    try {
      const feedPosts = await fetchFeed(userID, feedType);
      if (feedPosts.error) {
        throw new Error(feedPosts.error);
      }

      setPosts(feedPosts);
      setFilteredPosts(feedPosts);
    } catch (error) {
      console.error("❌ Error fetching feed data:", error);
    }
  };

  useEffect(() => {
    if (!userID) return;
    fetchFeedData(); // Fetch friends feed by default
  }, [userID]);

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
        <NavBar caseId={2} />
      </div>
      <AppContainer>
        <Routes>
          <Route
            path="/"
            element={
              <FeedMain
                user={userInfo}
                posts={posts}
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