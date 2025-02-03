import React from 'react';
import styled from 'styled-components';

const ProfileDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom:1rem;
`;

const ProfileImg = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h4`
  margin: 0;
  color: black;
  font-weight: 400;
`;

const PostDate = styled.p`
  margin: 0;
  color: gray;
  font-size: 0.8rem;
`;

const UserProfile = ({ profileImg, userName, postDate }) => {
  return (
    <ProfileDiv>
      <ProfileImg src={profileImg} alt={`${userName}'s profile`} />
      <TextContainer>
        <UserName>{userName}</UserName>
        <PostDate>{postDate}</PostDate>
      </TextContainer>
    </ProfileDiv>
  );
};

export default UserProfile;