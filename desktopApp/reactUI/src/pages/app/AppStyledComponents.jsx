import { styled } from 'styled-components'

export const AppStyledContainer = styled.div`
  display: flex;
  height: 100%;
  box-sizing:  border-box;

  .amount-input{
    width: 100%;
    max-width: 200px;
    padding: .5em;
    border-radius: .5em;
    border: 1px solid #7b00ff;
    margin-bottom: 1em;
  }
  .subets-btn{
    padding: .5em 1em;
    border-radius: .5em;
    border: 1px solid #7b00ff;
    background-color: #7b00ff;
    color: white;
    cursor: pointer;
  
  }
`
export const MiniPageContainer = styled.div`
  display: flex;
  max-height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`