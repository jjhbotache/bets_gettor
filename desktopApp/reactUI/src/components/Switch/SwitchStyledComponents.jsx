import styled, { css, keyframes } from "styled-components";

export const SwitchContainer = styled.div`

  .switch {
   cursor: pointer;
   display: none;
  }
  
  .label {
    cursor: pointer;
    position: relative;
    display: inline-block;
    width: 3em;
    height: 1.5em;
  }

  .slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.2em;
    width: 1.2em;


    left: 0.2em;
    bottom: 0.15em;

    background-color: white;
    transition: .1s;
    border-radius: 50%;
  }

  .switch:checked + .label .slider {
    background-color: #2196F3;
  }

  .switch:checked + .label .slider:before {
    transform: translateX(120%);
  }
`;