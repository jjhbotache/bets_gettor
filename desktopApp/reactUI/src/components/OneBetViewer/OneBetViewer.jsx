import { useEffect, useState } from "react";
import { betplayIcon, codereIcon, inProduction, wplayIcon, } from "../../const/consts.js";
import styles from "./OneBetViewer.module.css";
import { addDots, isMobile, strTimeToFloat, } from "../../functions/functions.jsx";
import { toast } from "react-toastify";
import { Badge, Divider, Grid, OneBetViewerContainer, } from "./OneBetViewerStyledComponents.jsx";
import { ProfitBadge } from "../BetItem/BetItemStyledComponents.jsx";
export default function OneBetViewer({ bet, betAmount }) {
  const iconsWidthAndHeight = 25;
  const [timer, setTimer] = useState( bet.period || (Date.now() - bet.startTime) / 1000 );

  // state for average time and shift
  const [averageTime, setAverageTime] = useState(0);
  // states for the minimuns and maximuns times
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [shift, setShift] = useState(5);

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

  useEffect(() => {
    updateAverageTime();
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
    !privateMode
        ? window.open(link, "_blank")
      : inProduction && pywebview.api.copy_to_clipboard(link);
  }
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
      <Grid $columns={4}>
        <strong>Team</strong>
        <strong>Odd</strong>
        <strong>BM</strong>
        <strong>Code</strong>
        {bet.options.map((option, index) => {
          return (
            <>
              <div> {option.name}</div>
              <div> {option.odd}</div>
              <div>
                <a onDoubleClick={(e) => {
                    e.preventDefault(); inProduction &&
                      pywebview.api.copy_to_clipboard(option.bookmaker.id) .then((re) => toast("Bookmaker id copied to clipboard") );
                      toast("TRYED Bookmaker id copied to clipboard");
                  }}
                  // onClick={(e) => onOpenLink(e, option.link)}
                  onContextMenu={(e) => onOpenLink(e, option.link, true)}
                  title="Open in new tab"
                >
                  <img
                    src={option.bookmaker.icon}
                    style={{ height: iconsWidthAndHeight, width: iconsWidthAndHeight }}
                  />
                </a>
              </div>
              <div className="col-2 d-flex flex-column justify-content-center align_items-center">
                {
                  <i
                    onClick={(e) => {
                      e.preventDefault();
                      pywebview.api
                        .get_js_code(
                          option.bookmaker.id,
                          option.name,
                          option.normalized_price
                        )
                        .then((js) => pywebview.api.copy_to_clipboard(js));
                    }}
                    className={
                      "d-block m-auto border border-info rounded fi fi-rr-square-terminal hoverable" +
                      (inProduction &&
                      pywebview.api.get_js_code(
                        option.bookmaker.id,
                        option.name,
                        option.normalized_price
                      )
                        ? ""
                        : " disabled")
                    }
                  ></i>
                }
              </div>
            </>
          );
        })}
      </Grid>
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
