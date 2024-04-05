import { BetItemContainer, ProfitBadge } from "./BetItemStyledComponents";

export default function BetItem({bet, onSetBet}) {
  const title = bet.options.map(o=>o.name!="Draw"?o.name:" VS ");
  return <BetItemContainer>
    <div onClick={e=>onSetBet(bet)}>

      {/* title */}
      <strong className="title">{title}</strong>
      <div className="grid">
        <small className='time'>{ bet.info.time }</small>
        <ProfitBadge $profit={bet.info.profit} > {"Profit: "+Math.floor(bet.info.profit)+"%"} </ProfitBadge>
      </div>
    </div>
  </BetItemContainer>
};
