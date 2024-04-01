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
  overflow: hidden;
  height: 95%;
  width: 80vw;
  max-width: 400px;
  ${props => props.$loading 
  ?css`animation: ${noLoadingAnimation} 1s linear infinite;`
  :css`animation: ${rainbowBorderAnimation} 4s linear infinite;`
  }
  border-radius: 1em;
  padding: .5em;

  header{
    background: #1e003d6a;
    margin: 1em 0;
    padding: 1em .4em;
    border-radius: 1em;
  }


`;



export const BetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  height: 85%;
  gap: 1em;
  z-index: 2;


  scrollbar-width: none; /* Para Firefox */

  &:hover {
    overflow-y: auto;
  }
`;
