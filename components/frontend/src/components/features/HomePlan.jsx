import React from "react";
import Plan from "./Plan";
import styled from "styled-components";

// This is a wrapper component that adapts the Plan component for use in the HomePage
const HomePlanWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HomePlan = () => {
  return (
    <HomePlanWrapper>
      <Plan />
    </HomePlanWrapper>
  );
};

export default HomePlan;
