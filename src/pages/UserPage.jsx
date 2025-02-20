import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import ProfileCard from "../components/Profile/ProfileCard";
import NavBar from "../components/NavBar/Full";
import Feed from "../components/NF-NG/Feed";

const UserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({
    user_name: "",
    user_id: "",
    user_bio: "",
    profile_picture: "",
    isPrivate: 0,
    relationship: "Follow", // Options: "Following", "Follow Back", "Follow", "Requested", "Unfollow" CHECK THIS LATER
  });
  const [loading, setLoading] = useState(true);

  const caseNumb = parseInt(localStorage.getItem("selectedCase"), 10);
  const myUserId = parseInt(localStorage.getItem("userID"), 10);

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
        });

        // FOR LATER MAYBE??
        // const postsResponse = await fetch(`/api/user/${userId}/posts`);
        // const postsData = await postsResponse.json();
        // setPosts(postsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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
  ];

  // change this to the correct user
  const handleDMClick = () => {
    navigate("/dms", { state: { chatUser: "Kim Seokjin" } });
  };

  //FOR DEBUGGING
  if (loading) {
    return <div>Loading...</div>; // Display a loading state while fetching
  }

  if (!user) {
    return <div>User not found</div>; // Handle the case if no user data is found
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
            username= {user.user_name}
            id = {userId}
            userid={`@${user.user_id}`}
            userPic={user.profile_picture}
            bio={user.user_bio}
            followers={1200}
            following={600}
            onDMClick={handleDMClick}
            relationship={user.relationship}
            isMyProfile={myUserId === userId}
          />

          {/* User's Posts */}
          {user.relationship === "Following" || !user.isPrivate ? (
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



