import styled from "styled-components";

export const BetItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin: 5px;
  border-radius:1em;
  border: 1px solid #7b00ff;
  box-shadow: 0 0 .4em .3em rgba(0, 0, 0, .9);
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.01);
  }
`;