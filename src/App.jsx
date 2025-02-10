
import React from 'react';
import styled from 'styled-components';
import FeedMain from './components/FeedMain';
import EditPost from "./components/EditPost";

const AppContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const App = () => {
  const userInfo = {
    user_name: "Jane Doe",
    profile_picture: "./src/dummy-profile-img.jpg",
  };

  const samplePosts = [
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
        likedUsers: [
          { profileImg: "./src/dummy-profile-img-2.jpg", userName: "John Smith" },
        ],
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
  ];

  return (
    <AppContainer>
      <FeedMain user={userInfo} posts={samplePosts} />
    </AppContainer>
  )
};

export default App;