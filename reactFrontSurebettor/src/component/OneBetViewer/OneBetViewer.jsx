import { useEffect, useState } from "react";
import { betplayIcon, codereIcon, wplayIcon } from "../../const/consts.js";
import styles from "./OneBetViewer.module.css";
import { addDots, isMobile } from "../../functions/functions.jsx";
export default function OneBetViewer({bet,betAmount}) {
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
    <div className="container border rounded " style={{width:"95%",maxWidth:400}}>
      {/* title, seconds and profit% */}
      <div className="row d-flex justify-content-center text-center">
        <h2 className="rounded bg-light bg-opacity-10 m-2">{bet.options.map(o=>o.name!="Draw"?o.name:" VS ")}
          <span className="badge bg-gradient m-1 border">1</span>
        </h2>
        <span className={`badge fs-6 rounded-pill text-light ${
                bet.info.profit < 10 ? "bg-danger":
                bet.info.profit < 20 ? "bg-warning":
                bet.info.profit < 30 ? "bg-info":
                bet.info.profit < 40 ? "bg-primary":
                bet.info.profit < 50 ? "bg-success":"bg-light text-dark"
              } w-auto`}>{"Profit: "+Math.floor(bet.info.profit)+"%"}</span>
      </div>
      <hr />
      {/* info */}
        <div className={` ${styles.info} row d-flex justify-content-center gap-1`}>
          
          <div className="row bg-light bg-opacity-10 overflow-hidden text-center">
            <div className="col-5"> <strong>Team</strong> </div>
            <div className="col-3"> <strong>Odd</strong> </div>
            {/* if the space is width enought, put bookmaker, otherwise, BM */}
            <div className="col-2" title="Bookmaker"> <strong>BM</strong> </div>
            <div className="col-2"> <strong>Code</strong> </div>
          </div>
          {bet.options.map((option, index) => {
            let onClickFunction;
            if(option.bookmaker.id === 3){
              option.link = "https://m.codere.com.co/deportescolombia/#/HomePage";
              onClickFunction = e => {
                e.preventDefault();
                navigator.clipboard.writeText(`${bet.options.map(o=>o.name!="Draw"?o.name:"-")}`)
                .then(re=>window.open(option.link, "_blank"))
                .catch((error) => console.error("Error copying text: ", error));
                
              }
            }
            return(
            // delete the text as a link and put it normal
            
            <div key={index} className={"row "+(index%2===1 ? "bg-light bg-opacity-10":"")}>
              <div className={"col-5 d-flex flex-column justify-content-center align_items-center "}>{option.name}</div>
              <div className={"col-3 d-flex flex-column justify-content-center align_items-center "}> {option.odd}</div>
              
              <div className={"col-2 d-flex flex-column justify-content-center align_items-center "}> 
              <a  href={option.link} target="_blank" className={`hoverable rounded border border-info p-0 m-0 ${styles.infoRow}`} onClick={onClickFunction}> 
                {option.bookmaker.id === 1 && ( <img className="d-block m-1 mx-auto rounded border" src={wplayIcon} style={{height:wAndH,width:wAndH}} /> )}
                {option.bookmaker.id === 2 && ( <img className="d-block m-1 mx-auto rounded border" src={betplayIcon} style={{height:wAndH,width:wAndH}} /> )}
                {option.bookmaker.id === 3 && ( <img className="d-block m-1 mx-auto rounded border" src={codereIcon} style={{height:wAndH,width:wAndH}} /> )}
              </a>
              </div>
              <div onClick={
                e => {
                  e.preventDefault();
                  
                  navigator.clipboard.writeText(option.code)
                  .then(re=>{new Notification("Copied to clipboard", {body: option.code=="no code"?"no code":("JS code to "+option.bookmaker.name)} );})
                  .catch((error) => console.error("Error copying text: ", error));
                }
              } className="col-2 d-flex flex-column justify-content-center align_items-center"><i className="d-block m-auto border border-info rounded fi fi-rr-square-terminal hoverable"></i></div>
            </div>
          )})
          }
        </div>
      
      <hr />
      {/* profit and execute info */}
      <div className="row">
        <div className="col">
          <h1>Bets info:</h1>
          {
            bet.options.map((option, index) => {
              bet.options[index].exact_amount_to_bet = betAmount * (parseFloat(option.prob_impl)/bet.info.sum);
              bet.options[index].normalized_price = Math.floor(option.exact_amount_to_bet / 100) * 100;
              bet.info.real_amount_to_bet = bet.options.reduce((a, b) => a + b.exact_amount_to_bet, 0);

              bet.options[index].revenue = (option.exact_amount_to_bet * option.odd);
              bet.options[index].real_profit = option.revenue - bet.info.real_amount_to_bet;

              bet.info.min_real_profit = Math.floor(Math.min(...bet.options.map(o=>o.real_profit)));

              return (
                <div className="row d-flex" key={index}>
                  <div className="col d-flex gap-2">
                    <i className="fi fi-rr-dice-alt"></i>
                    <span className="mb-0" title={option.exact_amount_to_bet}>{addDots(option.normalized_price)}</span>
                    {isMobile() && <small className="muted ">{option.exact_amount_to_bet}</small>}
                  </div>
                  <div className="col">
                    <h4>➡️➡️➡️➡️</h4>
                  </div>
                  <div className="col">
                    <span>{addDots(Math.floor(option.revenue))}</span>
                  </div>
                </div>
              )
            })
          }
          <hr />
          <h5>Total bet:&nbsp;{addDots(bet.info.real_amount_to_bet)}</h5>
          <h5>Total profit:&nbsp; <span className={bet.info.min_real_profit>0?"text-success":"text-danger"}>{addDots(bet.info.min_real_profit)}</span></h5>
        </div>
      </div>

    </div>
  )
};
