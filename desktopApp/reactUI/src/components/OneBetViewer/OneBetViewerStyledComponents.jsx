import styled, { css, keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    border: 0.2em solid #7d9eff;
    box-shadow: 0px 0px 20px 8px #000000;
  }
  50% {
    border: 0.2em solid #0014cb;
    box-shadow: 0px 0px 20px -2px #000000;
    transform: scale(1.01);
  }
  100% {
    border: 0.2em solid #fbfcff;
    box-shadow: 0px 0px 20px 8px #000000;
  }
`;

export const OneBetViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  border-radius: 1em;
  border: 1px solid #7b00ff;
  box-shadow: 0 0 .4em .3em rgba(0, 0, 0, .9);
  cursor: pointer;
  transition: all 0.2s;



  height: 80%;
  max-height: 85vh;
  overflow: hidden;

  ${
    props => props.$state == "No exists"
      ?css`
        border: dashed 0.2em rgb(168, 0, 0);
        border-spacing: 0.5em;
      `
      : props.$state == "No surebet"
      ?css`
        border: dashed 0.2em rgb(168, 168, 0);
        border-spacing: 0.5em;
      `
      : css`
        animation: ${pulseAnimation} 0.8s ease-in-out infinite;
      `
  }

  .time-dropdown{
    margin-top: 1em;
    width: 100%;
    display: flex;
    justify-content: center;

    &>div{
      /* make it floating */
      position: absolute;
      z-index: 2;
      background: #58009b;
      border: 1px solid #7b00ff;
      border-radius: 1em;
      padding: 1em;
      box-shadow: 0 0 .4em .3em rgba(0, 0, 0, .9);

      display: flex;
      
    }
  }

  .title{
    font-size: 1.5em;
    font-weight: 600;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .time{
    font-size: .8em;
    opacity: .6;
  }

  small{
    font-size: .7em;
    opacity: .6;
  }

  .btn-execute{
    margin-top: 1em;
    width: 100%;
    max-width: 10em;
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
    /* make it colorful */
    background: #03175f;
    color: white;
    padding: .5em;
    border-radius: 1em;
    cursor: pointer;
    border: none;
    /* add it a hover */
    transition: all .2s;
    &:hover{
      background: #7b00ff;
    }

  }
 

`;

export const Badge = styled.span`
  color: white;
  background: #03175f;
  padding: .3em;
  width: auto;
  min-width: 6em;
`

export const Divider = styled.hr`
  width: 100%;
  border: 1px solid #7b00ff;
  margin: 1em 0;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  width: 100%;
  margin-top: 5px;

  place-items: center;
`