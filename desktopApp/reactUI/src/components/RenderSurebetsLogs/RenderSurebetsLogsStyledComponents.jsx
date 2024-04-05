import styled from "styled-components";

export const RenderedSBLogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 100vw;
  gap: 1em;

  .row{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1em;
    width: 100%;
  }

  .separator{
    width: 100%;
    border: 0.1em solid white;
  }
`;