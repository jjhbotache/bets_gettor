import { betplayIcon, codereIcon, wplayIcon } from "../../const/consts.js";
export default function OneBetViewer({bet}) {
  const wAndH = 25;
  return(
    <div className="container border rounded ">
      <div className="row d-flex justify-content-center text-center">
        <h2 className="rounded bg-light bg-opacity-10 m-2">{bet.options.map(o=>o.name!="Draw"?o.name:" VS ")}
          <span className="badge bg-gradient m-1 border">1</span>
        </h2>
        <span className={`badge fs-6 rounded-pill text-dark text-bg-${
                (bet.info.profit<10?"danger":
                bet.info.profit<20?"warning":
                bet.info.profit<30?"info":
                bet.info.profit<40?"primary":
                bet.info.profit<50?"secondary":
                bet.info.profit<100?"success":"light"
                )
              } w-auto`}>{"Profit: "+Math.floor(bet.info.profit)+"%"}</span>
      </div>
      <hr />
      <div className="row d-flex justify-content-center">
        {bet.options.map((option, index) => (
          <div key={index} className={"row "+(index%2===1 && "bg-light bg-opacity-10")}>
            <div className={"col"}>{option.name}</div>
            <div className={"col"}>Odd: {option.odd}</div>
            <div className={"col"}>Bookmaker: 
            {option.bookmaker.id === 1 && ( <img className="rounded" src={wplayIcon} style={{height:wAndH,width:wAndH}} /> )}
            {option.bookmaker.id === 2 && ( <img className="rounded" src={betplayIcon} style={{height:wAndH,width:wAndH}} /> )}
            {option.bookmaker.id === 3 && ( <img className="rounded" src={codereIcon} style={{height:wAndH,width:wAndH}} /> )}

            </div>
          </div>
        ))
        }
      </div>
    </div>
  )
};
