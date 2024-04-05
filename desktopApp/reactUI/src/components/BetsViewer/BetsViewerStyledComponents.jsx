import styled, { css, keyframes } from 'styled-components';

const noLoadingAnimation = keyframes`
  0%   { border:  solid #7b00ff; }
  50%  { border:  solid #0059ff; }
  100% { border:  solid #7b00ff; }
`;

const rainbowBorderAnimation = keyframes`
  0%   { border:  solid #ff0000; }
  50%  { border:  solid #ffff00; }
  100% { border:  solid #ff0000; }
`;


export const BVContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 100%;
  max-width: 400px;
  border-radius: 1em;
  padding: .5em;

  ${
    props => props.$loading 
      ?css`animation: ${noLoadingAnimation} 1s linear infinite;`
      :css`animation: ${rainbowBorderAnimation} 4s linear infinite;`
  }


  header{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: #1e003d6a;
    margin: .2em 0;
    padding: 1em .4em;
    border-radius: 1em;
    max-height: 10vh;
  }

  .bets-container{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: .5em;
    /* max-height: 60vh; */
    scrollbar-width: none;
    overflow-y: auto;
  }

`;


