import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { apiRoute } from './const/consts'
import Nav from './component/Nav';
import BetsViewer from './component/BetsViewer/BetsViewer';
import OneBetViewer from './component/OneBetViewer/OneBetViewer';
import mockAnswer from "./mocks/sure_bets_response.json";
import Sidebar from './component/Sidebar/Sidebar';
import { isMobile } from './functions/functions';



function App() {
  const [surebets, setSureBets] = useState(mockAnswer)
  const numberOfSurebetsBefore = useRef(0)
  const [loading, setLoading] = useState(false)
  let timeToWait = 500;

  const [betOnViewer, setBetOnViewer] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  

  useEffect(() => {
    fetching()
  }, []);

  useEffect(() => {
    timeToWait = 500;
    if (surebets.length > numberOfSurebetsBefore.current && !isMobile()) {
      numberOfSurebetsBefore.current = surebets.length
      console.log(surebets)
      new Notification("New surebet");
    }
  }, [surebets]);


  function fetching() {
    // setLoading(true)
    // setTimeout(() => {
    //   setSureBets(mockAnswer.sort((a, b) => b.info.profit - a.info.profit));
    //   setLoading(false)
    //   fetching()
    // }, 2000);
    // return 
    console.log("fetching");
    setLoading(true)
    fetch(apiRoute+"/sure_bets")
    .then(res => res.json())
    .then(data => {
      // sort by profit
      data.sort((a, b) => b.info.profit - a.info.profit);
      
      // data.length === 0 ? (timeToWait = 0) : (timeToWait = 1000);
      timeToWait = 200;

      setSureBets(data)
      console.log(data)
      
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      console.log("fetching finished");
      setLoading(false)
      setTimeout(() => {
        fetching()
      }, timeToWait);
    })
  }

  console.log(pageIndex);
  return (
    <>
    <Nav/>

    <div className="d-flex  ">

      <Sidebar li={
        [
          ["Surebets", (<i className="fi fi-rs-receipt"></i>)],
          ["Bet viewer", (<i className="fi fi-sr-vector-circle"></i>)],
        ]
      } value={pageIndex} onChange={i=>{setPageIndex(i)}} />

      {pageIndex === 0 && (
        <div className="container mt-1 h-100 d-flex justify-content-center align-items-center ">
          <div className="row">
            <BetsViewer bets={surebets} loading={loading} onSetBet={bet=>{setBetOnViewer(bet);setPageIndex(1)}}/>
          </div>
        </div>
      )}
      {pageIndex === 1 && (
        betOnViewer ? ( 
          <div className="mt-1 w-100" >
            <OneBetViewer bet={betOnViewer} />
          </div>
        ) : (
          <div className="d-flex align-items-center flex-column gap-2 m-1 w-100" >
            <h1>Choose a bet from the surebets viewer</h1>
            <button className="btn btn-primary w-50" onClick={()=>{setPageIndex(0)}}>Surebets</button>
          </div>
        )
      )}

    </div>



    
    
    </>
  )
}

export default App
