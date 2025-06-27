import React from 'react';
import Plan from './Plan';
import styled from 'styled-components';

// This is a wrapper component that adapts the Plan component for use in the HomePage
const HomePlanWrapper = styled.div`
  width: 100%;
  max-width: 700px; /* Match the hero container width */
  margin: 0 auto;
  padding: 0;
  
  /* Override any nested PageWrapper styling from Plan component */
  > div {
    min-height: unset;
    padding: 0;
    margin: 0;
  }
`;

const HomePlan = () => {
  return (
    <HomePlanWrapper className="home-embedded">
      <Plan />
    </HomePlanWrapper>
  );
};

export default HomePlan;
