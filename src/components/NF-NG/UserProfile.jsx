import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

const NavDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`;

const ProfileDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
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

const MenuBtn = styled.button`
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #000000;
`;

const MenuPopup = styled.ul`
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 5px;
  width: 150px;
  z-index: 10;
`;

const MenuItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  color: #000000;
  &:hover {
    background: #f0f0f0;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const UserProfile = ({ profileImg, userName, postDate, isOwner, post, variant = "default" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (action) => {
    if (action === "edit" && post) {
      navigate(`/case/1/edit-post/${post.id}`, { state: { post } });
    } else if (action === "edit") {
      console.error("Post data is missing in UserProfile.jsx!");
    }
    setMenuOpen(false);
  };

  return (
    <NavDiv>
      <ProfileDiv>
        <ProfileImg src={profileImg} alt={`${userName}'s profile`} />
        <TextContainer>
          <UserName>{userName}</UserName>
          {variant === "default" && <PostDate>{postDate}</PostDate>}
        </TextContainer>
      </ProfileDiv>

      {variant === "default" && isOwner && (
        <>
          <MenuBtn onClick={toggleMenu}>
            <BsThreeDotsVertical />
          </MenuBtn>
          {menuOpen && (
            <MenuPopup ref={menuRef}>
              <MenuItem onClick={() => handleMenuClick("edit")}>Edit</MenuItem>
              <MenuItem onClick={() => handleMenuClick("block")}>Block</MenuItem>
              <MenuItem onClick={() => handleMenuClick("share")}>Share URL</MenuItem>
              <MenuItem onClick={() => handleMenuClick("report")}>Report</MenuItem>
              <MenuItem onClick={() => handleMenuClick("unfollow")}>Unfollow</MenuItem>
            </MenuPopup>
          )}
        </>
      )}
    </NavDiv>
  );
};

export default UserProfile;