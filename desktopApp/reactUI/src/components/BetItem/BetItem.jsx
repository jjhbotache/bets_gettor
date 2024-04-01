import { BetItemContainer } from "./BetItemStyledComponents";

export default function BetItem({bet, onSetBet}) {
  const title = bet.options.map(o=>o.name!="Draw"?o.name:" VS ");
  return <BetItemContainer>
    <div onClick={e=>onSetBet(bet)}>

    {/* title */}
    <strong><h4 className='text-center'>{title}</h4></strong>
    <div className="container">
      <div className="row">
        <div className="col">
          {/* minute */}
          <small className='text-muted'>{ bet.info.time }</small>
        </div>
        <div className="col d-flex justify-content-center">
          {/* badge */}
          {/* EXTRACT THIS INTO A STYLED COMPONENT */}
          <span className={`badge fs-6 rounded-pill text-light ${
            bet.info.profit < 10 ? "bg-danger":
            bet.info.profit < 20 ? "bg-warning":
            bet.info.profit < 30 ? "bg-info":
            bet.info.profit < 40 ? "bg-primary":
            bet.info.profit < 50 ? "bg-success":"bg-light text-dark"
          } w-auto`}>{"Profit: "+Math.floor(bet.info.profit)+"%"}</span>
        </div>
        <div className="col"></div>
      </div>
    </div>
    </div>
  </BetItemContainer>
};
