import BetItem from '../BetItem/BetItem'
import { BVContainer, BetsContainer } from './BetsViewerStyledComponents'



export default function BetsViewer({bets, loading, onSetBet}) {
  return(
    <>
    <BVContainer $loading={loading}>
      <header>
        <h1>Surebets</h1>
        <small >By: Juan Jose Huertas Botache</small>
      </header>
      <BetsContainer>
        {bets.map((bet, index) => <BetItem key={index} bet={bet} onSetBet={onSetBet} />)}       
      </BetsContainer>
    </BVContainer>
    </>
  )
};
