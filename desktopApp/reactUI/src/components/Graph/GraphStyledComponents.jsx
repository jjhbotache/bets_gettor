import styled from "styled-components";

export const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1em;
  box-sizing: border-box;
  /* height: auto; */
  /* overflow-y: auto; */
  /* scrollbar-width: none; */

  background-color: rgba(255,255,255,0.1);
  border-radius: 1em;
  margin: .5em 0;
  padding: 1em;

  .row{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
  }

  .graphs-container{
    width: 50vw;
    height: 60vh;
  }

  .badge{
    background: linear-gradient(to right, red -90%, blue 190%);
    font-size: .8em;
    padding: .5em 1em;
    border-radius: 1em;
    color: white;
  }
`;