import styled from "styled-components";

export const SidebarStyledContainer = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  height: 100%;
  background-color: #05003e !important; /* Usando variables para colores */
  box-shadow: 1px 1px 7px rgba(0, 0, 0, 0.502);
  transition: all 0.2s ease;

  
  width: ${ props => props.$window === false ? " 180px" : " 55px" };
  
  .burger{
    display: flex;
    justify-content: flex-end;
    rotate: 90deg;
    margin: 1em 0em;
    background: rgba(0, 0, 0, 0.3);
    border-radius: .3em;
    transition: all 0.1s ease;
    &:hover{
      cursor: pointer;
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }
  }

  .items-container{
    list-style-type: none;
    padding-left: 4px ;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 1em;
  }

`;

export const StyledItem = styled.div`
  width: 70px;
  display: flex;
  justify-content: start;
  align-items: center;

  ${props => props.$border && `border-left: .2em solid #3514c7`};
  
`;