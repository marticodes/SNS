import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaHome } from "react-icons/fa";

const FeedHeader = styled.div`
  width: 100%;
  padding: 1rem 0;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  jusitfy-content: center;
  align-items: center;
`;

const AppIcon = styled.div`
  cursor: pointer;
  padding-left: 1rem;
  font-size: 1.5rem;
  color: #7CB9E8;
  &:hover {
    color: #0056b3;
  }
`;

const SearchContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  background-color: #FFFFFF;
  color: #000000;
  text-align: left;
  &:focus {
    border-color: #007bff;
  }
`;

const SearchButton = styled.button`
  padding: 10px;
  margin-left: 0.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const SearchResults = styled.ul`
  width: 50%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
  padding: 0;
  list-style: none;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  color: #000000;
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
`;

const SearchResultItem = styled.li`
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #ddd;
  color: #000000;

  &:hover {
    background: #f0f0f0;
  }
`;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const FeedSearch = ({ posts, users, onSearch, onUserClick, resetFeed }) => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (event) => {
    const searchText = event.target.value?.toLowerCase() || ""; 
    setQuery(searchText);
  
    if (searchText.trim() === "") {
      setFilteredResults([]);
      return;
    }
  
    const matchedUsers = users?.filter((user) =>
      user?.userName?.toLowerCase().includes(searchText) 
    ) || [];
  
    const matchedPosts = posts?.filter((post) =>
      post?.text?.toLowerCase().includes(searchText) || 
      post?.hashtags?.some((hashtag) => hashtag?.toLowerCase().includes(searchText)) // ✅ Safe check
    ) || [];
  
    setFilteredResults([...matchedUsers, ...matchedPosts]);
  };

  const handleResultClick = (result) => {
    if (result.userName) {
      onUserClick(result.userName);
    } else if (result.type === "hashtag") {
      onSearch({ hashtags: [result.value] });
    }
    setQuery(result.userName || `#${result.value}`);
    setFilteredResults([]);
  };

  const handleSearchSubmit = () => {
    onSearch({ query });
    setFilteredResults([]);
  };

  const handleResetFeed = () => {
    setQuery("");
    setFilteredResults([]);
    resetFeed();
  };

  return (
    <FeedHeader>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search posts or users..."
          value={query}
          onChange={handleSearch}
        />
        <SearchButton onClick={handleSearchSubmit}><FaSearch/></SearchButton>
        </SearchContainer>
        {filteredResults.length > 0 && (
          <SearchResults>
            {filteredResults.map((result, index) => (
              <SearchResultItem key={index} onClick={() => handleResultClick(result)}>
                {result.profileImg ? (
                  <>
                    <ProfileImage src={result.profileImg} alt={result.userName} />
                    {result.userName}
                  </>
                ) : (
                  <>#{result.hashtags[0]}</>
                )}
              </SearchResultItem>
            ))}
          </SearchResults>
        )}
    </FeedHeader>
  );
};

export default FeedSearch;