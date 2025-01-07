import { useMemo } from "react";
import * as d3 from "d3";
import React from 'react'
type DataItem = {
  name: string;
  value: number;
};
type PieChartProps = {
  width: number;
  height: number;
  data: DataItem[];
  colors: any[];
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 10; // space between donut and label inflexion point

// const colors = [
//   "#e0ac2b",
//   "#e85252",
//   "#6689c6",
//   "#9a6fb0",
//   "#a53253",
//   "#69b3a2",
// ];

export const PieChart = ({ width, height, data,colors }: PieChartProps) => {
  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    // First arc is for the pie
    const sliceInfo = {
      innerRadius: 0,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = String(arcGenerator(sliceInfo));

    // Second arc is for the legend inflexion point
    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexionPoint = arcGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 20 * (isRightLabel ? 1 : -1);
    // const textAnchor = isRightLabel ? "start" : "end";
    const textAnchor = "middle";
    const label = grp.data.name + " (" + grp.value + ")";
    return (
      <g key={i}>
        <path d={slicePath} fill={colors[i]} />
        {/* <circle cx={centroid[0]} cy={centroid[1]} r={2} /> */}
        {/* <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        /> */}
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={12}
        >
          {label}
        </text>
      </g>
    );
  });

  return (
    <svg width={width} height={height} style={{ display: "inline-block"}}>
      <g transform={`translate(${width / 3}, ${height / 2})`}>{shapes}</g>
    </svg>
  );
};

export default function PieChartComponent({data} : {data:Array<{name:any,value:any}>}) {
  let width = 500, height = 400;
  // console.log(window.innerWidth);
  // if(window.innerWidth<=500){
  //   console.log("hemobile");
  //   width=500;
  //   height=400;
  // }
    if(data === null){
      return <div>unavailable stats</div>;
    }
    else{
      let colors = data.map(e=> {
        if(e.name==="HSK1" || e.name==="STARTER"){
          return "#7a7b7ecc";  //grey
        }
        else if(e.name==="HSK2" || e.name==="JUNIOR"){
          return "#69e45ecc"; //green
        }
        else if(e.name==="HSK3" || e.name==="SENIOR"){
          return  "#6a91dacc";  //blue
        }
        else{
          return  "#e693eecc"; //pink
        }
      }
      )
      return (<PieChart data={data} width={width} height={height} colors={colors}/>)
    }
};
