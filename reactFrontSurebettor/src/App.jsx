import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { apiRoute } from './const/consts'
import response from "./mocks/sure_bets_response.json";
import Nav from './component/Nav';
import { Link } from 'react-router-dom';
import BetsViewer from './component/BetsViewer/BetsViewer';
import OneBetViewer from './component/OneBetViewer/OneBetViewer';



function App() {
  const [surebets, setSureBets] = useState([])
  const numberOfSurebetsBefore = useRef(0)
  const [loading, setLoading] = useState(false)
  let timeToWait = 500;

  const [betOnViewer, setBetOnViewer] = useState(null);
  
  useEffect(() => {
    fetching()
  }, []);

  useEffect(() => {
    timeToWait = 500;
    if (surebets.length > numberOfSurebetsBefore.current ) {
      numberOfSurebetsBefore.current = surebets.length
      console.log(surebets)
      new Notification("New surebet");
    }
  }, [surebets]);


  function fetching() {
    setLoading(true)
    fetch(apiRoute+"/sure_bets")
    .then(res => res.json())
    .then(data => {
      // data.length === 0 ? (timeToWait = 0) : (timeToWait = 1000);
      timeToWait = 200;

      console.log(data)
      setSureBets(data)
      setTimeout(() => {
        fetching()
      }, timeToWait);
    })
    .finally(() => {
      setLoading(false)
    })
  }

  
  return (
    <>
    <Nav/>

    <div className="container h-100 d-flex justify-content-center align-items-center ">
      <div className="row">
        <BetsViewer bets={surebets} loading={loading} onSetBet={bet=>setBetOnViewer(bet)}/>
      </div>
    </div>

    {betOnViewer && ( <OneBetViewer bet={betOnViewer} />)}
    
    </>
  )
}

export default App
