import { useEffect, useState } from "react";
import { betplayIcon, codereIcon, inProduction, wplayIcon, } from "../../const/consts.js";
import { addDots, isMobile, strTimeToFloat, } from "../../functions/functions.jsx";
import { toast } from "react-toastify";
import { Badge, Divider, Grid, OneBetViewerContainer, } from "./OneBetViewerStyledComponents.jsx";
import { ProfitBadge } from "../BetItem/BetItemStyledComponents.jsx";
import Switch from "../Switch/Switch.jsx";

export default function OneBetViewer({ bet, betAmount }) {
  const iconsWidthAndHeight = 25;
  const [timer, setTimer] = useState( bet.period || (Date.now() - bet.startTime) / 1000 );

  // state for average time and shift
  const [averageTime, setAverageTime] = useState(0);
  // states for the minimuns and maximuns times
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [shift, setShift] = useState(5);
  const [execInfo, setExecInfo] = useState([]);


  const bookmakerIcons = {
    0: wplayIcon,
    1: betplayIcon,
    2: codereIcon,
  };


  function updateAverageTime() {
    inProduction &&
      pywebview.api.manage_surebet().then((s) => {
        const choosenSurebets = s.filter((s) => {
          const currentTime = strTimeToFloat(bet.info.time);
          const match_time_minutes = s.match_time_minutes;
          if (
            currentTime + shift >= match_time_minutes &&
            currentTime - shift <= match_time_minutes
          ) {
            // console.log("match_time_minutes", match_time_minutes);
            // console.log("currentTime", currentTime);
          }
          return (
            currentTime + shift >= match_time_minutes &&
            currentTime - shift <= match_time_minutes
          );
        });
        // console.log("choosenSurebets", choosenSurebets);
        // get the average period of the choosen surebets
        const averagePeriod =
          choosenSurebets.reduce((a, b) => a + b.period, 0) /
          choosenSurebets.length;
        const minPeriod = Math.min(...choosenSurebets.map((s) => s.period));
        const maxPeriod = Math.max(...choosenSurebets.map((s) => s.period));
        setMinTime(minPeriod);
        setMaxTime(maxPeriod);
        setAverageTime(averagePeriod);
      });
  }

  async function onCopyCode(option) {
    if (!inProduction) {
      toast("This feature is only available in production mode")
      return;
    };
    console.log("option", option);
    const js = await pywebview.api .get_js_code( option.bookmaker.id, option.name, option.normalized_price )
    await pywebview.api.copy_to_clipboard(js,false);
    toast("Code copied to clipboard");
  }

  useEffect(() => {
    updateAverageTime();
    const exectInfoToSet = []
    bet.options.forEach((option) => {
      exectInfoToSet.push({
        name: option.name,
        // if the bookmaker is already in the list, put incognito to true, else put it to false
        incognito: exectInfoToSet.some(e => e.bookmaker.id === option.bookmaker.id) ? true : false,
        bookmaker: option.bookmaker
      })
    });
    setExecInfo(exectInfoToSet)
  }, []);

  useEffect(() => {
    if (bet.noExists) {
      setTimer(bet.period);
    } else {
      var interval = setInterval(() => {
        // console.log("period",bet.period);
        setTimer(bet.period || (Date.now() - bet.startTime) / 1000);
      }, 250);
    }

    return () => {
      clearInterval(interval);
    };
  }, [bet]);

  const state = bet.noExists
    ? "No exists"
    : bet.noSurebet
      ? "No surebet"
      : "Surebet";

  const title = bet.options.map((o) => (o.name != "Draw" ? o.name : " VS "));
  bet.options.forEach((option,index) => {
    



    option.exact_amount_to_bet = betAmount * (parseFloat(option.prob_impl) / bet.info.sum);
    option.normalized_price = Math.floor(parseFloat(option.exact_amount_to_bet) / 100) * 100;
    bet.info.real_amount_to_bet = bet.options.reduce( (a, b) => parseFloat(a) + parseFloat(b.normalized_price), 0 );
    option.revenue = option.exact_amount_to_bet * option.odd;
    option.real_profit = option.revenue - bet.info.real_amount_to_bet;
    bet.info.min_real_profit = Math.floor( Math.min(...bet.options.map((o) => o.real_profit)) );
    // --------------------
    option.bookmaker.icon = bookmakerIcons[option.bookmaker.id];
    
    if (option.bookmaker.id === 2) { // codere
      option.link = "https://m.codere.com.co/deportescolombia/#/HomePage";
      option.onClickFunction = onClickCodere;
    }
  });
  
  function onClickCodere(){
    e.preventDefault();
    const textToCopy = title
    inProduction &&
      pywebview.api
        .copy_to_clipboard(textToCopy)
        .then((re) => window.open(option.link, "_blank"));
  };
  function onOpenLink(e, link, privateMode = false) {
    // if private is true, copy the text to clipboard
    e.preventDefault();

    if(!privateMode){
      window.open(link, "_blank")
    }else{
      inProduction?
      pywebview.api.copy_to_clipboard(link,false).then(e=>{
        toast("Link copied to clipboard");
      })
      :toast("This feature is only available in production mode")
    }
  }


  
  
  function setIncognitoExecution(option,checked){
    const exectInfoToSet = []
    // first, push the new value
    exectInfoToSet.push({
      name: option.name,
      incognito: checked,
      bookmaker: option.bookmaker
    })
    // then, push the rest of the values (if the bookmaker is already in the list, put incognito to the opposite value)
    bet.options.forEach((option) => {
      if(option.name === exectInfoToSet[0].name) return;
      // if the bookmaker is already in the list, put incognito to the opposite value. Else, put it to the same value as it was
      const incognito = exectInfoToSet.some(e => e.bookmaker.id === option.bookmaker.id)
        ? !exectInfoToSet.find(e => e.bookmaker.id === option.bookmaker.id).incognito : execInfo.find(e => e.name === option.name).incognito;
      exectInfoToSet.push({
        name: option.name,
        incognito: incognito,
        bookmaker: option.bookmaker
      })
    });
    setExecInfo(exectInfoToSet)
  }









  return (
    <OneBetViewerContainer $state={state}>
      {/* title, seconds and profit% */}
      <h4 className="title">{title}</h4>
      <Grid $columns={3}>
        <details className="time-dropdown">
          <summary>
            <Badge>{Math.round(timer) + " sg"}</Badge>
          </summary>
          <div
            className="dropdown-menu text-center bg-dark text-light p-2"
            aria-labelledby="segsDropdown"
          >
            <h4>{averageTime.toFixed(1)}</h4>
            <small className="text-muted">
              Average period for the SB with <strong>±{shift}</strong>
            </small>
            <small>
              {" "}
              <em className="d-block">
                {minTime.toFixed(1) + " - " + maxTime.toFixed(1)}
              </em>{" "}
            </small>
            <input
              className="form-control px-3"
              type="range"
              value={shift}
              onChange={(e) => {
                setShift(e.target.value);
                updateAverageTime();
              }}
            />
          </div>
        </details>
        <ProfitBadge $profit={bet.info.profit}>
          {" "}
          {"Profit: " + Math.floor(bet.info.profit) + "%"}{" "}
        </ProfitBadge>
        <small>{bet.info.time}</small>
      </Grid>
      <Divider />
      {/* info */}
      <Grid $columns={5}>
        <strong>Team</strong>
        <strong>Odd</strong>
        <strong>BM</strong>
        <strong>Code</strong>
        <strong>Incognito Execution</strong>
        {bet.options.map((option, index) => {
          const inputId = `input${index}_${option.name}`;
          const execInfoToUse = execInfo.find((e) => e.name === option.name);
          return (
            <>
              <div> {option.name}</div>
              <div> {option.odd}</div>
              <img
                className="hoverable"
                src={option.bookmaker.icon}
                style={{ height: iconsWidthAndHeight, width: iconsWidthAndHeight }}
                onClick={e=> onOpenLink(e,option.link)}
                onContextMenu={e=> onOpenLink(e,option.link,true)}
                title="Open link (right click to copy link to clipboard)"
                />
              <i onClick={e=> onCopyCode( option)} className="fi fi-rr-square-terminal hoverable" ></i>
              <Switch id={inputId} checked={!!execInfoToUse?.incognito} onChange={(e) => setIncognitoExecution(option,e.target.checked)} />
              
            </>
          );
        })}
      </Grid>
      <button className="btn-execute">
        <i className="fi fi-rr-play"></i>
      </button>
      <hr />
      {/* profit and execute info */}
          <h4>Bets info:</h4>
          {bet.options.map((option, index) => {
            return (
              <Grid $columns={3} key={index}>
                <div onClick={() => { inProduction && pywebview.api.copy_to_clipboard(option.normalized_price); toast("Amount to bet copied to clipboard"); }} >
                  <i className=" fi fi-rr-dice-alt"></i>
                  <span title={option.exact_amount_to_bet}> {addDots(option.normalized_price)} </span>
                </div>

                <h4>➡️</h4>
                <span>{addDots(Math.floor(option.revenue))}</span>
              </Grid>
            );
          })}
          <hr />
          <h5>Total bet:&nbsp;{addDots(bet.info.real_amount_to_bet)}</h5>
          <h5> Total profit:&nbsp;<span style={{color: (bet.info.min_real_profit > 0 ? "green" : "red")}} > {addDots(bet.info.min_real_profit)} </span></h5>
    </OneBetViewerContainer>
  );
}
