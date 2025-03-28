import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/Small"; 
import styled from "styled-components";
import FeedMain from "../components/NC/FeedMain.jsx";
import EditPost from "../components/NC/EditPost.jsx";
import NewPost from "../components/NC/NewPost.jsx";
import UserList from "../components/CG/servers.jsx";
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

const NCPage = () => {
  const navigate = useNavigate();
  const userID = parseInt(localStorage.getItem("userID"), 10);

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [currentCommunity, setCurrentCommunity] = useState(null);

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

    const fetchCommunities = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/channels/${userID}/`);
        const commIds = await res.json();
        const commDetails = await Promise.all(
          commIds.map(async (id) => {
            const infoRes = await fetch(`http://localhost:3001/api/channels/info/${id}/`);
            return infoRes.json();
          })
        );
        setCommunities(commDetails);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchUser();
    fetchCommunities();
  }, [userID, navigate]);

  const fetchFeed = async (communityId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/channels/post/${communityId}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching feed:", error);
      return [];
    }
  };

  useEffect(() => {
    if (currentCommunity) {
      const fetchFeedData = async () => {
        const feedPosts = await fetchFeed(currentCommunity.comm_id);
        setPosts(feedPosts);
      };

      fetchFeedData();
    }
  }, [currentCommunity]);

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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 70,
          width: "251px",
          height: "100%",
          backgroundColor: "#f1f1f1",
          overflowY: "auto",
          zIndex: 100000,
        }}
      >
        <UserList
          users={communities.map((c) => c.comm_name)}
          onUserClick={(name) => {
            const selectedCommunity = communities.find((c) => c.comm_name === name);
            setCurrentCommunity(selectedCommunity);
          }}
          ProfilePics={Object.fromEntries(communities.map((c) => [c.comm_name, c.comm_image]))}
        />
      </div>
      <AppContainer>
        <Routes>
          <Route
            path="/"
            element={<FeedMain user={userInfo} posts={posts} />}
          />
          <Route
            path="new-post"
            element={
              <NewPost
                user={userInfo}
                addNewPost={addNewPost}
              />
            }
          />
          <Route
            path="edit-post/:postId"
            element={
              <EditPost
                user={userInfo}
                updatePost={updatePost}
              />
            }
          />
        </Routes>
      </AppContainer>
    </>
  );
};

export default NCPage;