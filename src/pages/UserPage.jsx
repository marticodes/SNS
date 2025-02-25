import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import ProfileCard from "../components/Profile/ProfileCard";
import NavBar from "../components/NavBar/Full";
import Feed from "../components/NF-NG/Feed";

const fetchRelation = async (userId, relationType) => {
  try {
    let response;
    if (relationType === 2) {
      response = await fetch(`http://localhost:3001/api/relations/${userId}/2`);
    } else {
      response = await fetch(`http://localhost:3001/api/with/relations/${userId}/2`);
    }
    if (!response.ok) {
      throw new Error(`Error fetching relation for ${userId}`);
    }

    const userIds = await response.json();
    return userIds.length;
  } catch (error) {
    console.error(error);
    return 0; // Return 0 if there was an error
  }
};

const getRelationshipStatus = async (myUserId, targetUserId) => {
  try {
    // Case 1: Check if I follow them
    let response = await fetch(`http://localhost:3001/api/relations/${myUserId}/${targetUserId}`);
    let data = await response.json();
    if (response.ok && Array.isArray(data) && data.length > 0) {
      console.log("Data:", data);
      return "Unfollow";
    }    

    // Case 2: Check if I requested them
    response = await fetch(`http://localhost:3001/api/requests/${myUserId}`);
    data = await response.json();
    if (response.ok && Array.isArray(data) && data.includes(targetUserId)) {
      console.log("Data:", data);
      return "Requested";
    }

    // Case 3: Check if they follow me (invert user IDs)
    response = await fetch(`http://localhost:3001/api/relations/${targetUserId}/${myUserId}`);
    data = await response.json();
    if (response.ok && Array.isArray(data) && data.length > 0) {
      console.log("Data:", data);
      return "Follow Back";
    }

    // Case 4: Default case
    return "Follow";

  } catch (error) {
    console.error("Error fetching relationship status:", error);
    return "Follow"; 
  }
};


const UserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({
    user_name: "",
    user_id: "",
    user_bio: "",
    profile_picture: "",
    isPrivate: 0,
    relationship: "Not Found",
  });
  const [followersCount, setFollowersCount] = useState(0); // State for followers count
  const [followingCount, setFollowingCount] = useState(0); // State for following count
  const [loading, setLoading] = useState(true);

  const caseNumb = parseInt(localStorage.getItem("selectedCase"), 10);
  const myUserId = localStorage.getItem("userID");

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const response = await fetch(`http://localhost:3001/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setUser({
          user_name: data.user_name,
          profile_picture: data.profile_picture,
          user_id: data.id_name,
          user_bio: data.user_bio,
          isPrivate: data.visibility,
          relationship: "Not Found",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getRelationshipStatus(myUserId, userId);
      setUser((prevUser) => ({ ...prevUser, relationship: status }));
    };
  
    if (userId) {
      fetchStatus();
    }
  }, [myUserId, userId]); 

  useEffect(() => {
    // Fetch the follower count and following count
    const fetchCounts = async () => {
      const followers = await fetchRelation(userId, 1); // Followers count
      const following = await fetchRelation(userId, 2); // Following count
      setFollowersCount(followers); // Set followers count
      setFollowingCount(following); // Set following count
    };

    fetchCounts();
  }, [userId]);

  console.log("Relatioooon:", user.relationship);
  console.log("myid:", myUserId);
  console.log("userid:", userId);

  const posts = [
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
        upvotedUsers: 10,
        downvotedUsers: 2,
        shares: 3,
      },
    },
  ];

  const handleDMClick = () => {
    navigate("/dms", { state: { chatUser: "Kim Seokjin" } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div style={pageStyle}>
      {/* Fixed NavBar */}
      <div style={navBarStyle}>
        <NavBar caseId={caseNumb}/>
      </div>

      {/* Main content area */}
      <div style={contentStyle}>
        <div style={centerContentStyle}>
          {/* Profile Card */}
          <ProfileCard
            username={user.user_name}
            id={userId}
            userid={`@${user.user_id}`}
            userPic={user.profile_picture}
            bio={user.user_bio}
            followers={followersCount} // Use followersCount here
            following={followingCount} // Use followingCount here
            onDMClick={handleDMClick}
            isPrivate={user.isPrivate}
            relationship={user.relationship}
            isMyProfile={myUserId === userId}
          />

          {/* User's Posts */}
          {user.relationship === "Unfollow" || !user.isPrivate || (myUserId === userId) ? (
            <>
              <h2 style={feedTitleStyle}>Posts</h2>
              <Feed user={user} posts={posts} />
            </>
          ) : (
            <div style={privateProfileStyle}>
              <p>This account is private</p>
              <p>Follow to see their photos and videos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  display: "flex",
  height: "100vh",
  width: "100vw",
};

const navBarStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "180px",
  height: "100%",
  backgroundColor: "#fff",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
};

const contentStyle = {
  marginLeft: "20%",
  padding: "20px",
  width: "80%",
  overflowY: "auto",
  backgroundColor: "#fff",
};

const centerContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  marginTop: "20px",
};

const feedTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
  color: "#000",
};

const privateProfileStyle = {
  textAlign: "center",
  color: "#555",
  fontSize: "16px",
  padding: "20px",
};

export default UserPage;



