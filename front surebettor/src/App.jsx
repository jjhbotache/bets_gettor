import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { apiRoute } from './const/consts'
import response from "./mocks/sure_bets_response.json";



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
    <main className={`d-flex flex-column justify-content-between align-items-center border border-2 p-1 py-3 rounded  ${loading?"border-warning":"border-primary"} `}>
      <div>
        <h1>Surebets</h1>
        <h6>By: Juan Jose Huertas Botache</h6>
        <div className="mb-3">
          <label className="form-label">Bet amount:</label>
          <input type="number" className="form-control" value={betAmount} onInput={e=>setBetAmount(e.target.value)}/>
        </div>
      </div>
      <div className='w-100 h-100 bg-light bg-opacity-10 p-1 mx-2 rounded'>
        {
          surebets.length === 0 ? <h3>No surebets...</h3>
          :
          surebets.map((surebet,i) => (
            <div className={`bg-black bg-opacity-25 rounded-1 ${loading?"opacity-50":""} `} key={i}>
              <h4>{`${surebet.options[0].name} VS ${surebet.options[2].name}`}</h4>
              <h5>Profit: &nbsp; {Math.round(surebet.info.profit)}%</h5>
              <h5>Profit according to bet: &nbsp; {Math.round((surebet.info.profit/100) * betAmount)}</h5>
            </div>
          ))
        }
      </div>
      <div className="d-grid gap-2 my-1">
        <button type="button" className="btn btn-primary" onClick={openBookMaker}>Open bookmakers</button>
      </div>
    </main>
  )
}

export default App
