
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
import { GraphContainer } from './GraphStyledComponents';

export default function Graph({data,xData,yData,xLabel,yLabel,title}) {
  const [averagePeriod, setAveragePeriod] = useState(5);
  return(
    <GraphContainer>
      <h2 className='row'>{title}</h2>
      <div className="row">
          <span className="badge">{yLabel}</span>
        <div className="graphs-container">
          <ResponsiveContainer width="100%" height="50%">
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

          <ResponsiveContainer width="100%" height="50%">
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
      <div className="row">
        <span className="badge">{xLabel}</span>
        <input type="range" value={averagePeriod} max={Math.max(...data.map(i=>i[xData]))} onChange={e=>setAveragePeriod(e.target.value)} />
        <span>{averagePeriod}</span>
        <hr />
      </div>
    </GraphContainer>
  )
};
