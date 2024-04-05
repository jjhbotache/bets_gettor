import styled from "styled-components";

export const LoggerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100vw;
  gap: 1em;
`;

export const MiniPageRows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  height: 100%;
  max-height: 92vh;
  overflow-y: auto;
  scrollbar-width: none;

  .title {
    font-weight: bold;
    font-size: 2em;
    text-align: center;
    background: linear-gradient(to right, red, blue);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .refresh-btn{
    margin: 1em;
    padding: 0.5em 1em;
    border-radius: 1em;
    border: 1px solid #000;
    font-size: large;
    color: white;
    background: linear-gradient(to right, red -90%, blue 190%);
  }
  .separator{
    margin: 1em;
  }
`;

export const MiniPageGraphs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 92vh;
  max-width: 100vw;
  gap: 1em;
  overflow-y: auto; 
  box-sizing: border-box;
  scrollbar-width: none;
`;