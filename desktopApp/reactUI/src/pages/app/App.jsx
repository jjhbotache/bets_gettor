import { useEffect, useRef, useState } from 'react'

import Nav from '../../components/Nav/Nav';
import BetsViewer from '../../components/BetsViewer/BetsViewer';
import OneBetViewer from '../../components/OneBetViewer/OneBetViewer';
import Sidebar from '../../components/Sidebar/Sidebar';

import { surebetsPeriod } from '../../main';
import { inProduction } from '../../const/consts';
import surebetsMock from "../../mocks/sure_bets_response.json"
import { AppStyledContainer, MiniPageContainer } from './AppStyledComponents';

// TODO: take out this into a page folder with its own components



function App() {

  const [surebets, setSureBets] = useState([])
  const numberOfSurebetsBefore = useRef(0)
  const [loading, setLoading] = useState(false)
  const [betOnViewer, setBetOnViewer] = useState(null);
  const firstBetDone = useRef(false)
  const [pageIndex, setPageIndex] = useState(0);
  const [amount, setAmount] = useState(50000);
  const [sendLogs, setSendLogs] = useState(false);
  const listOfIdsToFetch = useRef([]);
  
  useEffect(() => {
    fetching();
  }, []);
  
  /**
   * Fetch the surebets from the server and set the state
   * 
   * @returns {void}
   */
  function fetching() {
    let timeToWait = 500;
    setLoading(true)
    if (!inProduction){
      setSureBets(surebetsMock)
      return
    }
    pywebview.api.sure_bets(listOfIdsToFetch.current)
    .then(bets => {
      // sort by profit
      bets.sort((a, b) => b.info.profit - a.info.profit);
      
      // data.length === 0 ? (timeToWait = 0) : (timeToWait = 1000);
      timeToWait = 500;

      setSureBets(bets)
      console.log(bets)
      
      
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      setLoading(false)
      setTimeout(() => {
        fetching()
      }, timeToWait);
    })
  }

  useEffect(() => {
    
    // if the number of surebets is bigger than the last time, send a notification (if its not mobile)
    if (surebets.length > numberOfSurebetsBefore.current) {
      numberOfSurebetsBefore.current = surebets.length

      inProduction && pywebview.api.create_notification("New Surebet",
      `There are ${surebets.length} surebets`, "https://www.google.com/s2/favicons?sz=64&domain_url=https://www.betburger.com/")
    }

    // TODO: refactor this to extract the logic to a function
    // update the periods of the bets
    surebetsPeriod.forEach((sp,i)=>{
      const existingBet = surebets.find(surebet => surebet.info.id === sp.info.id)
      const isTheOneThatIsOnViewer = sp.info.id === betOnViewer?.info.id;

      // if doesn't exist or if it's profit is negative, means that the bet is over, so we update the data and delete it from the array
      if(existingBet === undefined || existingBet?.info.profit < 0){
        sp.endTime = Date.now();
        sp.period = (sp.endTime - sp.startTime)/1000;
        sp.noSurebet = true;

        
        // if sendsLogs is true and the surebet has a positive profit, send the data to the server
        if(sendLogs && (sp.info.profit > 0)){
          sp.info.name = sp.options.map(o=>o.name!="Draw"?o.name:" VS ");
          if (inProduction){

            pywebview.api.create_notification(
              "Surebet sent",
              `Name: ${sp.info.name}\nProfit: ${sp.info.profit}\nPeriod: ${sp.period}`,
            )
            pywebview.api.send_mail(
              "A surebed has happened",
              `
              Here is the data of the surebet:
              Name: ${sp.info.name}
              Profit: ${sp.info.profit}
              Period: ${sp.period}
              `
            )
            pywebview.api.manage_surebet("POST",sp)
          }
        }

        // if really not exist delete it from the array, else 
        if(existingBet === undefined){
          sp.noExists = true; 
          sp.info.id === betOnViewer?.info.id && setBetOnViewer(sp);
          surebetsPeriod.splice(surebetsPeriod.indexOf(sp),1)
        }else{
          sp.noExists = false;
          // update the data of the bet on the array preserving the start time,end time, period, noSurebet and noExists
          surebetsPeriod[i] = {
            ...sp,
            ...existingBet,
          };
          sp.info.id === betOnViewer?.info.id && setBetOnViewer(surebetsPeriod[i]);
        } 

        // set on betViewer for last time and delete it from the array
        
        
      }else if( isTheOneThatIsOnViewer){
        // if exists and it's the one that is on the bet viewer , update all the data of the surebet on the array (except the start time) and set it on the betviewer
        surebetsPeriod[i] = {
          ...sp,
          ...existingBet,
        };
        setBetOnViewer(surebetsPeriod[i]);
      }

    })

    surebets.forEach(s =>{
      const existingBet = surebetsPeriod.find(sp => sp.info.id === s.info.id)
      // if doesn't exist, means that is a new bet, so we add it to the array
      if(existingBet === undefined){
        const sObj = {
          ...s,
          startTime: Date.now(),
          endTime: null,
          period: null
        };
        surebetsPeriod.push(sObj)
      }
    })
    
  }, [surebets]);

  useEffect(() => {
    // if the betOnViewer is not null, set the listOfIdsToFetch to the id of the betOnViewer
    betOnViewer && (listOfIdsToFetch.current = [betOnViewer.info.id]);
  }, [betOnViewer]);



  return(
    <>
    <Nav/>
    <AppStyledContainer>
      <Sidebar li={
        [
          { label: "Surebets", icon: <i className="fi fi-rs-receipt"></i> },
          { label: "Bet viewer", icon: <i className="fi fi-sr-vector-circle"></i> }
        ]
      } value={pageIndex} onChange={i=>{setPageIndex(i)}} />

      <MiniPageContainer>
        {pageIndex === 0 && (
          <BetsViewer bets={surebets} loading={loading} onSetBet={bet=>{
            setBetOnViewer(bet);
            setPageIndex(1);
            firstBetDone.current=true;
            setBetOnViewer(surebetsPeriod.find(sp=>sp.info.id===bet.info.id));
            }}/>
        )}


        {pageIndex === 1 && (
          betOnViewer ? ( 
            <div className="mt-1 w-100" >
              <div className="input-group input-group-sm mb-sm-3 mx-auto mb-1" style={{maxWidth:"400px"}}>
                <span className="input-group-text">Bet amount</span>
                <input type="number" step={2500} className="form-control bg-dark text-light" value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
              </div>
              <OneBetViewer bet={betOnViewer} betAmount={amount} />
            </div>
          ) : (
            <div className="d-flex align-items-center flex-column gap-2 m-1 w-100" >
              <h1>Choose a bet from the surebets viewer</h1>
              <button className="btn btn-primary w-50" onClick={()=>{setPageIndex(0)}}>Surebets</button>
            </div>
          )
        )}
      </MiniPageContainer>
    </AppStyledContainer>
    
    </>
  )
}

export default App
