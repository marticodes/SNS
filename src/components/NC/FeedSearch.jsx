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

const ResetButton = styled.button`
  padding: 10px;
  margin-left: 0.5rem;
  border: none;
  background-color:rgb(84, 166, 252);
  color: white;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color:rgb(24, 133, 250);
  }
`;

const FeedSearch = ({ onSearch, resetFeed }) => {
  const [query, setQuery] = useState("");

  const handleSearchSubmit = () => {
    if (query.trim() === "") {
      resetFeed();
    } else {
      onSearch(query);
      localStorage.setItem("SearchedWord", query); // Store search word in localStorage 
      onSearch(query);
    }
  };

  const handleResetFeed = () => {
    setQuery("");
    resetFeed();
    localStorage.removeItem("SearchedWord");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(); 
    }
  };

  return (
    <FeedHeader>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={handleSearchSubmit}>
          <FaSearch />
        </SearchButton>
        {query && (
        <ResetButton
          onClick={handleResetFeed}
        >
          Reset
        </ResetButton>
      )}
      </SearchContainer>
    </FeedHeader>
  );
};

export default FeedSearch;
