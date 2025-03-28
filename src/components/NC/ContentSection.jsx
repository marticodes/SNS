import React from 'react';
import styled from 'styled-components';

// Styled Components
const ContentDiv = styled.div`
  margin-top: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #000;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.4rem;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
`;

const HashTagContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const HashTag = styled.span`
  background-color:rgb(243, 252, 253);
  color: #007bff;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color:rgb(203, 229, 232);
  }
`;

// Component
const ContentSection = ({ text, hashtags, images = [], hashtagClick }) => {
  return (
    <ContentDiv>
      {text && <Text>{text}</Text>}
      {Array.isArray(images) && images.length > 0 && (
        <ImageGrid>
          {images.map((img, index) => (
            <Image key={index} src={img} alt={`Post Image ${index}`} />
          ))}
        </ImageGrid>
      )}
      {Array.isArray(hashtags) && hashtags.length > 0 && (
        <HashTagContainer>
          {hashtags.map((hashtag, index) => (
            <HashTag onClick={() => hashtagClick(hashtag)} key={index}>#{hashtag}</HashTag>
          ))}
        </HashTagContainer>
      )}
    </ContentDiv>
  );
};

export default ContentSection;