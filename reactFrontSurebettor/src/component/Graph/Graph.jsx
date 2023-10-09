
import styles from './Graph.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';1
export default function Graph({data,xData,YData,xLabel,yLabel,title}) {
  // console.log("data",data);
  // console.log("xData",xData);
  // console.log("YData",YData);
  return(
    <div className="col-12 col-lg-6 p-0">
      <div className="container-fluid">
        <div className="row"><span className='text-center'>{title}</span></div>
        <div className="row">
          <div className="col-2 d-none d-md-flex justify-content-center align-items-center text-center  text-break p-0">
            {yLabel}
          </div>
          <div className="col p-0">
            <div className={styles.chart1 + " overflow-hidden"}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xData} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey={YData} stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="row text-center">
          <span>
            {xLabel}
          </span>
          <hr />
        </div>
      </div>
    </div>
  )
};

