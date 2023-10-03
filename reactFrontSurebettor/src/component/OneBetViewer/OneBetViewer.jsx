export default function OneBetViewer({bet}) {
  return(
    <div className="container border">
      <div className="row text-center">
        <h2>{bet.info.id}){bet.options.map(o=>o.name!="Draw"?o.name:" VS ")}</h2>
      </div>
      <div className="row">
        <div className="col">
          <h3>Profit: {Math.floor(bet.info.profit)}%</h3>
        </div>
      </div>
      <div className="row">
        {bet.options.map((option, index) => (
          <div key={index} className="row">
            <div className="col">{option.name}</div>
            <div className="col">Odd: {option.odd}</div>
            <div className="col">Bookmaker: {option.bookmaker.name}</div>
          </div>
        ))
        }
      </div>
    </div>
  )
};
