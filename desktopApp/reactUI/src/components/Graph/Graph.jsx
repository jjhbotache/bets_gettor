
import { useState } from 'react';
import { calculateAverage } from '../../functions/functions';
import styles from './Graph.module.css';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  LineChart,
  Legend,
} from "recharts";
export default function Graph({data,xData,yData,xLabel,yLabel,title}) {
  const [averagePeriod, setAveragePeriod] = useState(5);
  return(
    <div className="col-12 p-0">
      <div className="container-fluid">
        <div className="row"><h2 className='text-center'>{title}</h2></div>
        <div className="row">
          <div className="col-2 d-none d-md-flex justify-content-center align-items-center text-center  text-break p-0">
            <span className="badge bg-primary">{yLabel}</span>
          </div>
          <div className="col p-0">
            <div className={styles.chart1 + " overflow-hidden"}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                  }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey={xData} name="" unit="" />
                  <YAxis type="number" dataKey={yData} name="" unit="" />
                  <Tooltip cursor={{ strokeDasharray: "1 1" }} />
                  <Scatter name="A school" data={data} fill="#8884d8" />
                  {/* Agrega una línea, aquí asumimos valores de ejemplo para x1, y1, x2, y2 */}
                  <Line type="monotone" dataKey={xData} stroke="black" dot={false} />

                  <LineChart
                  width={"100%"}
                  height={"100%"}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey={xData} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={yData} stroke="#8884d8" dot={false} />
                </LineChart>
                </ScatterChart>
                
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={calculateAverage(data,yData,xData,averagePeriod)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey={xData} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={yData} stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>
        <div className="row text-center px-3">
          <span className="badge bg-primary w-auto mx-auto">{xLabel}</span>
          <input className='px-5' type="range" value={averagePeriod} max={Math.max(...data.map(i=>i[xData]))} onChange={e=>setAveragePeriod(e.target.value)} />
          <span>{averagePeriod}</span>
          <hr />
        </div>
      </div>
    </div>
  )
};


/* 
import React, { PureComponent } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 }
];

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/simple-line-chart-kec3v";

  render() {
    return (
      
    );
  }
}
 */