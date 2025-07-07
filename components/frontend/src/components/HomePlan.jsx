import React from 'react';
import Plan from './Plan';
import styled from 'styled-components';

// This is a wrapper component that adapts the Plan component for use in the HomePage
const HomePlanWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 0;
  margin-top: 5rem; /* Increase margin to clear the navbar completely */
  margin-bottom: 1rem; /* Keep small margin at bottom */
  
  /* Override any nested PageWrapper styling from Plan component */
  > div {
    min-height: unset;
    padding: 0;
    margin: 0;
    height: 100%;
  }
`;

const HomePlan = () => {
  return (
    <HomePlanWrapper className="home-embedded">
      <Plan isEmbedded={true} />
    </HomePlanWrapper>
  );
};

export default HomePlan;
