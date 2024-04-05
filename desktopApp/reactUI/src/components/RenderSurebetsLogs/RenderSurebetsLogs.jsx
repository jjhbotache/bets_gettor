import { useEffect, useState } from "react";
import { RenderedSBLogsContainer } from "./RenderSurebetsLogsStyledComponents";
import { Grid } from "../OneBetViewer/OneBetViewerStyledComponents";
import SBLogRow from "./SBLogRow";

function RenderSurebetsLogs({ surebetsLogs,onOrder,asc,order, onDeleteRow}) {

  return (
    <RenderedSBLogsContainer>
      <Grid $columns={4}>
        <div className="" onClick={e=>{onOrder("Name")}}>Name{ order==="Name" && (asc ? "▲" : "▼") }</div>
        <div className="" onClick={e=>{onOrder("Profit")}}>Profit{ order==="Profit" && (asc ? "▲" : "▼") }</div>
        <div className="" onClick={e=>{onOrder("Period")}}>Period{ order==="Period" && (asc ? "▲" : "▼") }</div>
        <div className="" onClick={e=>{onOrder("Match")}}>M. Time{ order==="Match" && (asc ? "▲" : "▼") }</div>
      </Grid>
      <hr className="separator" />
      <Grid $columns={4}>
        {surebetsLogs.map((surebet,index) => <SBLogRow key={index} index={index} surebet={surebet} onDeleteRow={onDeleteRow} />)}
      </Grid>
    </RenderedSBLogsContainer>
  );
}

export default RenderSurebetsLogs;
