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

  .title{
    font-size: 1.5em;
    font-weight: 600;
    text-align: center;
  }

  .grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    margin-top: 5px;

    place-items: center;
  }
  .time{
    font-size: .8em;
    opacity: .6;
  }
`;

export const ProfitBadge = styled.span`
  font-size: 1em;
  padding: 5px;
  border-radius: 5em;
  width: auto;
  max-width: 7em;
  color: #fff;
  background-color: ${props => {
    switch (true) {
      case props.$profit < 10:
        return "#dc3545";
      case props.$profit < 20:
        return "#ffc107";
      case props.$profit < 30:
        return "#17a2b8";
      case props.$profit < 40:
        return "#007bff";
      case props.$profit < 50:
        return "#28a745";
      default:
        return "#f8f9fa";
    }
  }};
`;