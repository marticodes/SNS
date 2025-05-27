import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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

  const fetchFeed = useCallback(async (communityId) => {
    if (!communityId) {
      console.log("No community ID provided for feed fetch");
      return;
    }

    try {
      console.log(`📡 Fetching feed for community ID: ${communityId}`);
      const response = await fetch(`http://localhost:3001/api/recomm/feed/channel/${communityId}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }
      const feedData = await response.json();
      console.log("Feed data received:", feedData);
      setPosts(feedData);
    } catch (error) {
      console.error("❌ Error fetching feed:", error);
      setPosts([]);
    }
  }, []);

  // Get community ID from URL
  const getCommIdFromUrl = () => {
    const pathParts = location.pathname.split('/');
    const commIdIndex = pathParts.indexOf('2') + 1;
    return pathParts[commIdIndex];
  };

  // Set initial community based on URL parameter
  useEffect(() => {
    const urlCommId = getCommIdFromUrl();
    //console.log("URL commId from path:", urlCommId);
    //console.log("Available communities:", communities);
    
    if (urlCommId && communities.length > 0) {
      //console.log("Setting initial community from URL:", urlCommId);
      const initialCommunity = communities.find(c => c.comm_id === parseInt(urlCommId));
      if (initialCommunity) {
        //console.log("Found initial community:", initialCommunity);
        setCurrentCommunity(initialCommunity);
      } else {
        //console.log("No community found for ID:", urlCommId);
      }
    } else {
      //console.log("No commId in URL or communities not loaded yet");
    }
  }, [location.pathname, communities]);

  // Fetch feed whenever a new community is selected
  useEffect(() => {
    //console.log("Current community changed:", currentCommunity);
    if (currentCommunity) {
      //console.log("Fetching feed for community:", currentCommunity.comm_id);
      fetchFeed(currentCommunity.comm_id);
    } else {
      //console.log("No current community selected");
    }
  }, [currentCommunity, fetchFeed]);

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: "100000"  }}>
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
            console.log("Selected community:", selectedCommunity);
            if (selectedCommunity) {
              console.log("Setting new community:", selectedCommunity.comm_id);
              setCurrentCommunity(selectedCommunity);
              navigate(`/case/2/${selectedCommunity.comm_id}`);
            }
          }}
          ProfilePics={Object.fromEntries(communities.map((c) => [c.comm_name, c.comm_image]))}
        />
      </div>
      <AppContainer>
        <Routes>
          <Route path="/:commId" element={
            <FeedMain 
              user={userInfo} 
              posts={posts} 
              community_id={currentCommunity?.comm_id}
              showSelectMessage={!currentCommunity}
            />
          } />
          <Route path="/" element={
            <FeedMain 
              user={userInfo} 
              posts={posts} 
              community_id={currentCommunity?.comm_id}
              showSelectMessage={!currentCommunity}
            />
          } />
          <Route path="/new-post" element={<NewPost user={userInfo} community_id={currentCommunity?.comm_id} />} />
          <Route path="/edit-post/:postId" element={<EditPost user={userInfo} />} />
        </Routes>
      </AppContainer>
    </>
  );
};

export default NCPage;