import Nav from '../../components/Nav/Nav.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { useEffect, useRef, useState } from 'react';
import { apiRoute, inProduction } from '../../const/consts.js';
import RenderSurebetsLogs from '../../components/RenderSurebetsLogs/RenderSurebetsLogs.jsx';
import Graph from '../../components/Graph/Graph.jsx';
import { surebetsPerMinute } from '../../functions/functions.jsx';
import surebetsMock from "../../mocks/surebets_logs_response.json"
import { LoggerContainer, MiniPageGraphs, MiniPageRows } from './LoggerStyledComponents.jsx';

export default function Logger() {
  const [pageIndex, setPageIndex] = useState(0);
  const [surebetsLogs, setSurebetsLogs] = useState([]);
  const [surebetsToRender, setSurebetsToRender] = useState([]);
  const deleteWarning = useRef(null);

  const [order, setOrder] = useState(undefined);
  const [asc, setAsc] = useState(false);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetching();
  }, []);

  useEffect(() => {
    console.log("ordering");
    if (order === undefined) {
      setSurebetsToRender(surebetsLogs);
    }

    if (order === "Name") {
      if (asc) {
        setSurebetsToRender(surebetsLogs.sort((a, b) => a.team1.localeCompare(b.team1)));
      } else {
        setSurebetsToRender(surebetsLogs.sort((a, b) => b.team1.localeCompare(a.team1)));
      }
    } 
    else if (order === "Profit") {
      if (asc) {
        setSurebetsToRender(surebetsLogs.sort((a, b) => a.profit - b.profit));
      } else {
        setSurebetsToRender(surebetsLogs.sort((a, b) => b.profit - a.profit));
      }
    }
    else if (order === "Period") {
      if (asc) {
        setSurebetsToRender(surebetsLogs.sort((a, b) => a.period - b.period));
      } else {
        setSurebetsToRender(surebetsLogs.sort((a, b) => b.period - a.period));
      }
    }
    else if (order === "Match") {
      if (asc) {
        setSurebetsToRender(surebetsLogs.sort((a, b) => a.match_time_minutes - b.match_time_minutes));
      } else {
        setSurebetsToRender(surebetsLogs.sort((a, b) => b.match_time_minutes - a.match_time_minutes));
      }
    }
    
    console.log("order and asc",order,asc);
  }, [order, surebetsLogs,asc]);


  function deleteRow(id) {
    if (deleteWarning.current || confirm("Are you sure you want to delete this row?")) {
      deleteWarning.current = true;
    }
    else{
      return;
    }

    inProduction && pywebview.api.manage_surebet("DELETE",{ id: id })
      .then(res => {
        console.log("res", res);
        setSurebetsLogs(surebetsLogs.filter(surebet => surebet.id !== id));
        
      })
      .catch(err => console.log(err));
  }

  function fetching() {
    if(!inProduction){
      setSurebetsLogs(surebetsMock);
      return;
    }
    setLoading(true);
    inProduction && pywebview.api.manage_surebet("GET")
      .then(res => {
        console.log("res", res);
        // revertir el order del array obtenido
        setSurebetsLogs(res.reverse());
        setOrder(undefined);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
    <Nav/>
    <LoggerContainer>
        <Sidebar li={
            [
              {
                title: "Bets",
                icon: <i className="fi fi-rr-clipboard-list"></i>,
              },
              {
                title: "Graphs",
                icon: <i className="fi fi-br-stats"></i>,
              },
            ]
          } value={pageIndex} onChange={i=>{setPageIndex(i)}} />
        {/* page */}
        {
          pageIndex === 0 && (
            <MiniPageRows>
              <h1 className='title'>Logger ({surebetsLogs.length})</h1>
              <button onClick={fetching} type="button" className="refresh-btn">{loading?"loading...":"refresh"} </button>
              <hr className='separator'/>
              <RenderSurebetsLogs surebetsLogs={surebetsToRender} onOrder={
                param =>{
                  setOrder(param);
                  setAsc(!asc);
                }
              } asc={asc} order={order} onDeleteRow={id=>deleteRow(id)}/>
            </MiniPageRows>
          )
        }
        {
          pageIndex === 1 && (
            <MiniPageGraphs>
              <Graph data={surebetsLogs.map(surebet=>(
                    {
                      "M. time": Math.round(surebet.match_time_minutes),
                      "Period": surebet.period,
                    }
                  )).sort((a,b)=>a["M. time"]-b["M. time"])} 
                  xData="M. time" 
                  yData="Period" 
                  xLabel="Match time" 
                  yLabel="Bet existing sgs" 
                  title="Time - Period"/>
              <Graph data={surebetsLogs.map(surebet=>(
                    {
                      "M. time": Math.round(surebet.match_time_minutes),
                      "Profit": surebet.profit,
                    }
                  )).sort((a,b)=>a["M. time"]-b["M. time"])} 
                  xData="M. time" 
                  yData="Profit" 
                  xLabel="Match time" 
                  yLabel="Profit" 
                  title="Time - Profit"/>
              <Graph data={surebetsPerMinute(surebetsLogs).sort((a,b)=>a["M. time"]-b["M. time"])} 
                    xData="M. time" 
                    yData="surebetsAmount" 
                    xLabel="Match time" 
                    yLabel="S. Amount" 
                    title="Time - Amount"/>
            </MiniPageGraphs>

          )
        }
    </LoggerContainer>
    </>

  )

  
};
