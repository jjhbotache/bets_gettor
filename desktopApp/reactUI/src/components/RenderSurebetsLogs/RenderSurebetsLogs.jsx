import { useEffect, useState } from "react";

function RenderSurebetsLogs({ surebetsLogs,onOrder,asc,order, onDeleteRow}) {


  

  return (
    <>
      <div className="row mx-1 bg-info bg-opacity-10 text-center mb-1 fs-6 flex-nowrap">
        <div className="col hoverable border m-1" onClick={e=>{onOrder("Name")}}>Name{
          order==="Name" && (asc ? "▲" : "▼")
        }</div>
        <div className="col hoverable border m-1" onClick={e=>{onOrder("Profit")}}>Profit{
          order==="Profit" && (asc ? "▲" : "▼")
        }</div>
        <div className="col hoverable border m-1" onClick={e=>{onOrder("Period")}}>Period{
          order==="Period" && (asc ? "▲" : "▼")
        }</div>
        <div className="col hoverable border m-1 " onClick={e=>{onOrder("Match")}}>M. Time{
          order === "Match" && (asc ? "▲" : "▼")
        }</div>
      </div>
      {surebetsLogs.map((surebet,index) => (
        <div key={surebet.id} className={`row mx-1 p-1 rounded text-center ${index%2===0?"bg-black bg-opacity-50":""}`}>
          <div className="col d-flex align-items-center">
          <i className="fi fi-br-trash hoverable h-100" onClick={e=>onDeleteRow(surebet.id)}></i>
          {surebet.team1+" VS "+surebet.team2 }
          </div>
          <div className="col">{Math.round(surebet.profit)}%</div>
          <div className="col">{Math.floor(surebet.period)+" SGs"}</div>
          <div className="col">{Math.round(surebet.match_time_minutes)}</div>
        </div>
      ))}
    </>
  );
}

export default RenderSurebetsLogs;
