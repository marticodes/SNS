import React from 'react';
import styled from 'styled-components';
import Feed from './components/Feed';

const AppContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const App = () => {
  const userInfo ={
    user_name: 'Jane Doe',
    profile_picture: './src/dummy-profile-img.jpg',
  }
  const samplePost = {
    profileImg: './src/dummy-profile-img.jpg',
    userName: 'Jane Doe',
    postDate: '2025-01-21',
    text: 'This is a sample feed post with images.',
    hashtags: ['nature', 'photo'],
    images: [
      '../src/dummy-feed-img-1.jpg',
      '../src/dummy-feed-img-2.jpg',
      '../src/dummy-feed-img-3.jpg',
    ],
    reactions: {
      likes: 10,
      votes: 5,
      comments: 3,
      shares: 2,
    },
    comments: [
      {
        profileImg: './src/dummy-profile-img-2.jpg',
        userName: 'John Smith',
        text: 'Awesome post!',
        replies: [
          {
            profileImg: './src/dummy-profile-img-4.jpeg',
            userName: 'Alice Brown',
            text: 'Agreed!',
          },
        ],
      },
      {
        profileImg: './src/dummy-profile-img-4.jpeg',
        userName: 'Alice Brown',
        text: 'Really nice!',
        replies: [],
      },
    ]
  };
  const samplePost2 = {
    profileImg: './src/dummy-profile-img-2.jpg',
    userName: 'John Smith',
    postDate: '2025-01-21',
    text: 'This is a sample feed post with text only.',
    images: [
    ],
    hashtags: ['example'],
    reactions: {
      likes: 0,
      votes: 0,
      comments: 3,
      shares: 2,
    },
    comments: [
      {
        profileImg: './src/dummy-profile-img-2.jpg',
        userName: 'John Smith',
        text: 'Awesome post!',
        replies: [
          {
            profileImg: './src/dummy-profile-img-4.jpeg',
            userName: 'Alice Brown',
            text: 'Agreed!',
          },
        ],
      },
      {
        profileImg: './src/dummy-profile-img-4.jpeg',
        userName: 'Alice Brown',
        text: 'Really nice!',
        replies: [],
      },
    ]
  };

  return (
    <AppContainer>
      <Feed user = {userInfo} post={samplePost} commentType="nested" />
      <Feed user = {userInfo} post={samplePost2} commentType="flat" />
    </AppContainer>
  );
};

export default App;