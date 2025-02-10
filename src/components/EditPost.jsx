import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled Components
const EditContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  outline: none;
`;

const ImagePreview = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  background-color: ${({ cancel }) => (cancel ? "#ccc" : "#007bff")};
  color: white;

  &:hover {
    background-color: ${({ cancel }) => (cancel ? "#bbb" : "#0056b3")};
  }
`;

// Component
const EditPost = () => {
  const navigate = useNavigate();

  // ✅ Mock existing post data
  const [postData, setPostData] = useState({
    text: "This is the existing post text.",
    images: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
    ],
  });

  const handleTextChange = (e) => {
    setPostData({ ...postData, text: e.target.value });
  };

  const handleSave = () => {
    console.log("Post updated:", postData);
    navigate("/"); // ✅ Redirect back to feed after saving
  };

  const handleCancel = () => {
    navigate("/"); // ✅ Cancel and return to feed
  };

  return (
    <EditContainer>
      <Title>Edit Your Post</Title>
      <TextArea value={postData.text} onChange={handleTextChange} />

      <ImagePreview>
        {postData.images.map((img, index) => (
          <Image key={index} src={img} alt={`Post Image ${index}`} />
        ))}
      </ImagePreview>

      <ButtonGroup>
        <Button cancel onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </ButtonGroup>
    </EditContainer>
  );
};

export default EditPost;