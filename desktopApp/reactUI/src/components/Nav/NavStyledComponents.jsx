import { Link } from "react-router-dom";
import styled from "styled-components";

export const NavStyledContainer = styled.nav`

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b003e;
  
  height: 50px;
  min-height: 50px;
  width: 100%;
  color: #fff;
  padding: 0 1em;
  box-sizing: border-box;
  overflow:hidden;

  .tabs-container{
    list-style: none;
    display: flex;
    justify-content: start;
    align-items: end;
    width: 100%;
    height: 100%;
    gap:1em;
    
    .tab{
      height: 70%;
      border-radius: .5em .5em 0 0;
      background: #190024;
      transition: all ease .3s;
      &:hover{
        height: 95%;
        background: #170020;
        box-shadow:  0 -2px 2px 0 #8e518e;
        cursor: pointer;
      }


    }
  }
`;

export const StyledLink = styled(Link)`
  box-sizing: border-box;
  display: block;
  color: rgba(255,255,255,.5);
  text-decoration: none;
  width: 100%;
  height: 100%;
  margin: .5em;
  margin-bottom: 0;
  
  ${props=>props.$active && `
    font-weight: 600;
    color: #f4f4f4;
  `};

  &:hover{
    color:unset;
  }

`;
