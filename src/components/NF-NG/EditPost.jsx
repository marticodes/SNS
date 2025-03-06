import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import UserProfile from "./UserProfile";
import NavBar from "../NavBar/Small"
import axios from "axios";

// Styled Components
const EditPostContainer = styled.div`
  display: flex;
  width: 85%;
`;

const PostDiv = styled.div`
  width: 60%;
  align-items: center;width: 80%;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #000000;
`;

const TextArea = styled.textarea`
  width: 95%;
  height: 300px;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  outline: none;
  background-color: #FFFFFF;
  color: #000;
  &:focus {
    border: 1px solid #007bff;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const UploadLabel = styled.label`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const PreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
`;

const PreviewVideo = styled.video`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgb(177, 169, 169);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #007bff;
  }
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

const EditPost = ({ posts, updatePost }) => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const userID = parseInt(localStorage.getItem("userID"), 10);

  const location = useLocation();
  const originalPost = posts.find((post) => post.id === parseInt(postId));

  if (!originalPost) {
    navigate("/case/1");
    return null;
  }

  const [postText, setPostText] = useState(originalPost.text);
  const [mediaFiles, setMediaFiles] = useState(originalPost.images || []); 

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file)); 
    setMediaFiles([...mediaFiles, ...fileURLs]);
  };

  const handleDeleteMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index)); 
  };

  const handleSave = () => {
    if (!userID) {
      alert("User not logged in!");
      return;
    }
  
    axios.post(`http://localhost:3001/api/posts/content`, {
      post_id: postId,
      content: postText,
      user_id: userID,
    })
    .then(() => {
      console.log("✅ Post updated successfully");
      navigate("/case/1");
    })
    .catch((error) => console.error("❌ Update Error:", error));
  };

  const handleCancel = () => {
    navigate("/case/1");
  };

  return (
    <EditPostContainer>
    <PostDiv>
      <Title>Edit Your Post</Title>
      <UserProfile profileImg={originalPost.profileImg} userName={originalPost.userName} variant="header" />

      <TextArea value={postText} onChange={handleTextChange} />

      <UploadContainer>
        <UploadLabel htmlFor="file-upload">Upload Images/Videos</UploadLabel>
        <FileInput id="file-upload" type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} />
      </UploadContainer>

      <PreviewContainer>
        {mediaFiles.map((file, index) => (
          <PreviewWrapper key={index}>
            {file.includes("video") ? (
              <PreviewVideo controls>
                <source src={file} type="video/mp4" />
                Your browser does not support the video tag.
              </PreviewVideo>
            ) : (
              <PreviewImage src={file} alt={`Preview ${index}`} />
            )}
            <DeleteButton onClick={() => handleDeleteMedia(index)}>✖</DeleteButton>
          </PreviewWrapper>
        ))}
      </PreviewContainer>

      <ButtonGroup>
        <Button cancel onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </ButtonGroup>
      </PostDiv>
    </EditPostContainer>
  );
};

export default EditPost;