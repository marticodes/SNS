import React from 'react';
import styled from 'styled-components';
import { BiSolidLike, BiUpvote, BiDownvote } from 'react-icons/bi';

// Styled Components
const ReactionSummaryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.2rem 0;
`;

const ReactionDiv = styled.div`
  display: flex;
  gap: 1rem;
`

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: #555;
`;

const ReactionNum = styled.span`
  color: #555;
  font-weight: 400;
`;

const LikeSpan = styled.span`
  color: #007bff;
`

const SelectedEmoji = styled.span`
  font-size: 0.8rem;
`;

// Component
const ReactionSummary = ({ likes, votes, comments, shares, selectedEmoji }) => {
  return (
    <ReactionSummaryContainer>
      <ReactionDiv>
        <ReactionItem>
          <LikeSpan><BiSolidLike /></LikeSpan>
          <ReactionNum>{likes}</ReactionNum>
        </ReactionItem>
        <ReactionItem>
          <BiUpvote />
          <ReactionNum>{votes}</ReactionNum>
          <BiDownvote />
        </ReactionItem>
        {selectedEmoji && (
        <ReactionItem>
          <SelectedEmoji>{selectedEmoji}</SelectedEmoji>
        </ReactionItem>
        )}
      </ReactionDiv>

      <ReactionDiv>
      <ReactionItem>
        <ReactionNum>{comments}</ReactionNum> comments
      </ReactionItem>
      <ReactionItem>
        <ReactionNum>{shares}</ReactionNum> shares
      </ReactionItem>
      </ReactionDiv>
    </ReactionSummaryContainer>
  );
};

export default ReactionSummary;