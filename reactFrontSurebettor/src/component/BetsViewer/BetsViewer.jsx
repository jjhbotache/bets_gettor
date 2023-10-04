import styles from './BV.module.css' 



const colors = ["border-warning", "border-secondary", "border-success", "border-danger", "border-info"];
export default function BetsViewer({bets, loading, onSetBet}) {
  return(
    <div className={`container-fluid border-4 rounded p-1 ${loading?styles.rainbowBorder:styles.noLoading} ${styles.BVContainer} `}>
      <div className="row">
        <h1>Surebets</h1>
        <small className="muted">By: Juan Jose Huertas Botache</small>
      </div>
      <div className={`row border rounded m-0 m-sm-1 bg-dark ${styles.betsContainer}`}>
        <div className="col">
          {bets.map((bet, index) => (
            <div key={index} className={`row mx-2 mb-1 d-flex justify-content-center align-content-center p-1 rounded bg-black bg-opacity-50 ${styles.hoverable}`}
            onClick={e=>onSetBet(bet)}
            >
              <strong><h4 className='text-center'>{bet.options.map(o=>o.name!="Draw"?o.name:" VS ")}</h4></strong>
              <span className={`badge fs-6 rounded-pill text-light text-bg-${
                (bet.info.profit<10?"danger":
                bet.info.profit<20?"warning":
                bet.info.profit<30?"info":
                bet.info.profit<40?"primary":
                bet.info.profit<50?"secondary":
                bet.info.profit<100?"success":"light"
                )
              } w-auto`}>{"Profit: "+Math.floor(bet.info.profit)+"%"}</span>
            </div>
          ))}       
        </div>
      </div>
    </div>
  )
};
