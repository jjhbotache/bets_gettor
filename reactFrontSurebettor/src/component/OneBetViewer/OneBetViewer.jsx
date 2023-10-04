import { useEffect, useState } from "react";
import { betplayIcon, codereIcon, wplayIcon } from "../../const/consts.js";
import styles from "./OneBetViewer.module.css";
export default function OneBetViewer({bet}) {
  const wAndH = 25;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  }, []);

  return(
    <div className="container border rounded ">
      {/* title, seconds and profit% */}
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
      {/* info */}
      <div className={` ${styles.info} row d-flex justify-content-center gap-1`}>
        <div className="row bg-light bg-opacity-10 overflow-hidden">
          <div className="col-6"> <strong>Team</strong> </div>
          <div className="col-3"> <strong>Odd</strong> </div>
          {/* if the space is width enought, put bookmaker, otherwise, BM */}
          <div className="col-3"> <strong>{
            innerWidth <420?"BM":"Bookmaker"
            }</strong> </div>
        </div>
        {bet.options.map((option, index) => (
          <div key={index} className={"row "+(index%2===1 ? "bg-light bg-opacity-10":"")}>
            <div className={"col-6 d-flex flex-column justify-content-center align_items-center "}>{option.name}</div>
            <div className={"col-3 d-flex flex-column justify-content-center align_items-center "}> {option.odd}</div>
            <div className={"col-3 d-flex flex-column justify-content-center align_items-center "}> 
            {option.bookmaker.id === 1 && ( <img className="d-block m-auto rounded" src={wplayIcon} style={{height:wAndH,width:wAndH}} /> )}
            {option.bookmaker.id === 2 && ( <img className="d-block m-auto rounded" src={betplayIcon} style={{height:wAndH,width:wAndH}} /> )}
            {option.bookmaker.id === 3 && ( <img className="d-block m-auto rounded" src={codereIcon} style={{height:wAndH,width:wAndH}} /> )}
            </div>
          </div>
        ))
        }
      </div>
    </div>
  )
};
