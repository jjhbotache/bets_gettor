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

  height: 80%;
  max-height: 80%;
  width: 100%;
  max-width: 400px;

  ${props => props.$loading 
    ?css`animation: ${noLoadingAnimation} 1s linear infinite;`
    :css`animation: ${rainbowBorderAnimation} 4s linear infinite;`
  }
  border-radius: 1em;
  padding: .5em;


  header{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background: #1e003d6a;
    margin: .2em 0;
    padding: 1em .4em;
    border-radius: 1em;
  }

  .bets-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1em;
    flex-grow: 1;
    
    scrollbar-width: none; /* Para Firefox */
    
    overflow-x: hidden;
    overflow-y: scroll;
  }

`;


