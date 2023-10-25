import { useEffect, useState } from "react";
import { betplayIcon, codereIcon, wplayIcon } from "../../const/consts.js";
import styles from "./OneBetViewer.module.css";
import { addDots, isMobile, strTimeToFloat } from "../../functions/functions.jsx";
export default function OneBetViewer({bet,betAmount}) {
  const wAndH = 25;
  // console.log("onBetViewer",bet); 
  const [timer, setTimer] = useState(bet.period||(Date.now()-bet.startTime)/1000);


  // state for average time and shift
  const [averageTime, setAverageTime] = useState(0);
  // states for the minimuns and maximuns times
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [shift, setShift] = useState(5);


  function updateAverageTime() {
    pywebview.api.manage_surebet().then(s => {
      const choosenSurebets = s.filter(s => {
        const currentTime = strTimeToFloat(bet.info.time);
        const match_time_minutes = s.match_time_minutes;
        if(currentTime+shift >= match_time_minutes && currentTime-shift <= match_time_minutes){
          console.log("match_time_minutes", match_time_minutes);
          console.log("currentTime", currentTime);
        }
        return currentTime+shift >= match_time_minutes && currentTime-shift <= match_time_minutes;
      });
      console.log("choosenSurebets", choosenSurebets);
      // get the average period of the choosen surebets
      const averagePeriod = choosenSurebets.reduce((a, b) => a + b.period, 0) / choosenSurebets.length;
      const minPeriod = Math.min(...choosenSurebets.map(s => s.period));
      const maxPeriod = Math.max(...choosenSurebets.map(s => s.period));
      setMinTime(minPeriod);
      setMaxTime(maxPeriod);
      setAverageTime(averagePeriod);
    });
  }

  useEffect(() => {
    updateAverageTime();
  }, []);

  useEffect(() => {
    if (bet.noExists) {
      setTimer(bet.period);
    }else{
      var interval = setInterval(() => {
        // console.log("period",bet.period);
        setTimer(bet.period||(Date.now()-bet.startTime)/1000);
      }, 250);
    }

    return () => {
      clearInterval(interval);
    };
  },[bet]);

  return(
    <div className={`container rounded ${bet.noExists?(styles.noBet):styles.bet} `} style={{width:"95%",maxWidth:400}}>
      {/* title, seconds and profit% */}
      <div className="row d-flex justify-content-center text-center">
        <h2 className="rounded bg-light bg-opacity-10 m-2">{bet.options.map(o=>o.name!="Draw"?o.name:" VS ")}
          
          <div className="dropdown open">
            <span className="badge bg-gradient m-1 border border-1 dropdown-toggle" type="button" id="segsDropdown" data-bs-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">{
            Math.round(timer)+" sg"
            }</span>
            <div className="dropdown-menu text-center bg-dark text-light p-2" aria-labelledby="segsDropdown">
              <h4>{averageTime.toFixed(1)}</h4>
              <small className="text-muted">Average period for the SB with <strong>±{shift}</strong></small>
              <small> <em className="d-block">{minTime.toFixed(1) + " - " + maxTime.toFixed(1) }</em> </small>
              <input className="form-control px-3" type="range" value={shift} onChange={e=>{setShift(e.target.value);updateAverageTime();}} />
            </div>
          </div>

          


        </h2>
        <div className="row">
          <div className="col">
            <span className="text-muted">{bet.info.time}</span>
          </div>
          <div className="col"><span className={`badge fs-6 rounded-pill text-light mx-auto ${
                bet.info.profit < 10 ? "bg-danger":
                bet.info.profit < 20 ? "bg-warning":
                bet.info.profit < 30 ? "bg-info":
                bet.info.profit < 40 ? "bg-primary":
                bet.info.profit < 50 ? "bg-success":"bg-light text-dark"
              } w-auto`}>{"Profit: "+Math.floor(bet.info.profit)+"%"}</span></div>
          <div className="col"></div>
        </div>
        
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
            if(option.bookmaker.id === 2){
              option.link = "https://m.codere.com.co/deportescolombia/#/HomePage";
              onClickFunction = e => {
                e.preventDefault();
                const textToCopy = bet.options.map(o => o.name != "Draw" ? o.name : "-").join(" vs ");
                pywebview.api.copy_to_clipboard(textToCopy)
                .then(re=>window.open(option.link, "_blank"))
                
              }
            }
            return(
            // delete the text as a link and put it normal
            
            <div key={index} className={"row "+(index%2===1 ? "bg-light bg-opacity-10":"")}>
              <div className={"col-5 d-flex flex-column justify-content-center align_items-center "}>{option.name}</div>
              <div className={"col-3 d-flex flex-column justify-content-center align_items-center "}> {option.odd}</div>
              
              <div className={"col-2 d-flex flex-column justify-content-center align_items-center "}> 
              <a  href={option.link} target="_blank" className={`hoverable rounded border-1 border border-info p-0 m-0 ${styles.infoRow}`} onClick={onClickFunction}> 
              <img className="d-block m-1 mx-auto rounded border" src={option.bookmaker.icon} style={{height:wAndH,width:wAndH}} />
              </a>
              </div>
              <div onClick={
                e => {
                  e.preventDefault();
                  pywebview.api.copy_to_clipboard(option.code)
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
              bet.options[index].normalized_price = Math.floor(parseFloat(option.exact_amount_to_bet) / 100) * 100;
              bet.info.real_amount_to_bet = bet.options.reduce((a, b) => parseFloat(a) + parseFloat(b.normalized_price), 0);

              bet.options[index].revenue = (option.exact_amount_to_bet * option.odd);
              bet.options[index].real_profit = option.revenue - bet.info.real_amount_to_bet;

              bet.info.min_real_profit = Math.floor(Math.min(...bet.options.map(o=>o.real_profit)));

              return (
                <div className="row d-flex" key={index}>
                  <div className="col text-center gap-2 link-info hoverable" onClick={e=>{
                    // copy the amount to bet
                    e.preventDefault();
                    navigator.clipboard.writeText(option.normalized_price)
                    .then(re=>{
                      const notification = new Notification("Copied to clipboard", { body: option.normalized_price });

                      setTimeout(() => {
                        notification.close();
                      }, 2500);
                    })
                    // create a notification that last 2 seconds
                  }}>
                    <i className=" fi fi-rr-dice-alt"></i>
                    <span className="mb-0" title={option.exact_amount_to_bet}>{addDots(option.normalized_price)}</span>
                  </div>
                  <div className="col-1 d-flex align-items-center">
                    <h4>➡️</h4>
                  </div>
                  <div className="col d-flex align-items-center justify-content-center">
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
