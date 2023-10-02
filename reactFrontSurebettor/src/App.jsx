import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { apiRoute } from './const/consts'
import response from "./mocks/sure_bets_response.json";
import Nav from './component/Nav';
import { Link } from 'react-router-dom';
import BetsViewer from './component/BetsViewer/BetsViewer';



function App() {
  const [surebets, setSureBets] = useState([])
  const numberOfSurebetsBefore = useRef(0)
  // const [surebets, setSureBets] = useState(response)
  const [loading, setLoading] = useState(false)
  let timeToWait = 500;

  const [betAmount, setBetAmount] = useState(50000);
  
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
      data.length === 0 ? (timeToWait = 0) : (timeToWait = 500);

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

  function openBookMaker(bookmaker_id = 0) {
    // <button _ngcontent-serverapp-c176="" id="dropdownLogin" class="btn-inicio w-100 mb-2 no-row"> Iniciar sesión </button>

    let betplayPage = window.open("https://betplay.com.co", 'popupWindow');
    setTimeout(() => {
      console.log(betplayPage);
      betplayPage.getElementById("dropdownLogin").click();
    }, 5000);

    
  }

  return (
    <>
    <Nav/>

    <div className="container h-100 d-flex justify-content-center align-items-center ">
      <div className="row">
        <BetsViewer bets={surebets}/>
      </div>
    </div>
    </>
  )
}

export default App
