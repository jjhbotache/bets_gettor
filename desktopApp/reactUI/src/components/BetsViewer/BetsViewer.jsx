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
          <BetItem key={index} bet={bet} onSetBet={onSetBet}/>
        ))}       
      </div>
    </BVContainer>
  )
};
