import BetItem from '../BetItem/BetItem'
import { BVContainer } from './BetsViewerStyledComponents'



export default function BetsViewer({bets, loading, onSetBet}) {
  return(
    <BVContainer $loading={loading}>
      <header>
        <h1>Surebets</h1>
        <small >By: Juan Jose Huertas Botache</small>
      </header>
      <div className='bets-container'>
        {bets.map((bet, index) => (
          <h1 key={index} onClick={()=>{onSetBet(bet)}}> hola <br/>asdasdasd </h1>
        ))}       
      </div>
    </BVContainer>
  )
};
