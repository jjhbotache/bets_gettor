export default function SBLogRow({surebet, onDeleteRow, index}) {
  return (
    <div style={{
      backgroundColor: index%2==0 ? "rgba(0,0,0,.1)" : "rgba(0,0,0,.8)",
      gridColumn: "1 / span 4",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      width: "100%",
      textAlign: "center",
    }}>
      <div className="">
        <i className="fi fi-br-trash" onClick={e=>onDeleteRow(surebet.id)}></i> {surebet.team1+" VS "+surebet.team2 }
      </div>
      <div className="">{Math.round(surebet.profit)}%</div>
      <div className="">{Math.floor(surebet.period)+" SGs"}</div>
      <div className="">{Math.round(surebet.match_time_minutes)}</div>
    </div>
  );
  
};
