import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios"; 

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

const myUserID = parseInt(localStorage.getItem("userID"), 10);

const UserProfile = ({
  user_id,
  userName = "Unknown User",  // default fallback
  profileImg,
  postDate,
  post,
  variant = "default",
  newpost = false,
  timeleft = "",
}) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const defaultProfileImage = "/src/default-profile.png";

  useEffect(() => {
    if (!user_id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${user_id}`);
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };

    fetchUser();
  }, [user_id]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = async (action) => {
    try {
      if (action === "edit") {
        navigate(`/case/1/edit-post/${post.post_id}`);
      } else if (action === "mute") {
        await axios.post(`http://localhost:3001/api/relations/restriction/update`, {
          user_id_1: myUserID, 
          user_id_2: user_id, 
          restricted: 2,
        });
        console.log("✅ User muted successfully");
      }
      setMenuOpen(false);
    } catch (err) {
      console.error(`❌ Error processing action "${action}":`, err);
    }
  };

  const handleUserClick = () => {
    navigate(`/user/${user_id}`);
  };

  return (
    <NavDiv>
      <ProfileDiv>
      <ProfileImg 
        src={profileImg?.trim() ? profileImg : defaultProfileImage} 
        alt={`${userName || "Unknown User"}'s profile`} 
        onClick={handleUserClick}
      />
        <TextContainer>
          <UserName onClick={handleUserClick}>{userName}</UserName>
          {variant === "default" && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PostDate>{postDate} • {timeleft}</PostDate>
            </div>
          )}
        </TextContainer>
      </ProfileDiv>

      {variant === "default" && !newpost && (
        <>
          <MenuBtn onClick={toggleMenu}>
            <BsThreeDotsVertical />
          </MenuBtn>
          {menuOpen && (
            <MenuPopup ref={menuRef}>
              {myUserID === user_id ? (
              <MenuItem onClick={() => handleMenuClick("edit")}>Edit</MenuItem>
              ) : (
              <MenuItem onClick={() => handleMenuClick("mute")}>Mute</MenuItem>)}
            </MenuPopup>
          )}
        </>
      )}
    </NavDiv>
  );
};

export default UserProfile;