import styles from './BV.module.css'
export default function BetsViewer({bets}) {



  return(
    <div className={`container-fluid border p-0 p-sm-1 ${styles.BVContainer} `}>
      <div className="row">
        <h1>Surebets</h1>
        <small className="muted">By: Juan Jose Huertas Botache</small>
      </div>
      <div className={`row border m-0 m-sm-1 ${styles.betsContainer}`}>
        <div className="col bg-dark">
          holi
        </div>
      </div>
    </div>
  )
};
