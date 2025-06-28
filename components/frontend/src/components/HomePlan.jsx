import React from 'react';
import Plan from './Plan';
import styled from 'styled-components';

// This is a wrapper component that adapts the Plan component for use in the HomePage
const HomePlanWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  
  /* Remove any conflicting padding/margins */
  padding: 0;
  
  /* Ensure the Plan component fits properly */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HomePlan = () => {
  return (
    <HomePlanWrapper>
      <Plan isEmbedded={true} />
    </HomePlanWrapper>
  );
};

export default HomePlan;
