import React from 'react'
import * as d3 from 'd3'
import { updateExpression } from '@babel/types';
import { selector } from 'postcss-selector-parser';

export default class Graph extends React.Component{
  constructor(props){
    super(props)
      this.state={
        performance: {
          eng: '',
          exc: ''
        }
      }
    this.drawBarChart = this.drawBarChart.bind(this);
  }


  componentDidMount(){  
    this.drawBarChart()
  }

  componentDidUpdate(){
    d3.selectAll('svg').remove()
    this.drawBarChart()
  }

  drawBarChart(){
    const { eng, exc, int, rel, foc, str } = this.props
    let performance = [eng, exc, int, rel, foc, str]
    const svgGraph = d3.select(this.refs.graph)
      .append("svg")
      .attr("width", 500)
      .attr("height", 170)
      

    const xScale = d3.scaleBand()
      .range([60, 480])
      .domain(["eng", "exc", "int", "rel", "foc", 'str'])
      .padding(1)

    svgGraph.append('g')
      .attr('class', 'axis x')
      .call(d3.axisTop(xScale))
      .selectAll('text')
      .attr('dy', null)
      .attr("transform", "translate(-30, 150)")  
      
    const yScale = d3.scaleLinear()
      .range([150, 10])
      .domain([0, 1.0])
   
    svgGraph.append('g')
      .attr('class', 'axis y')
      .call(d3.axisRight(yScale))
      .selectAll('text')
      .attr("transform", "translate(0," + 150 + ")")
      .attr("transform", "translate(20, 0)rotate(0)")
    
    
    svgGraph.selectAll("rect")
      .data(performance).enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", (datapoint) => datapoint * 100)
        .attr("fill", "gray")
        .attr("x", datapoint => xScale(datapoint))
        .attr("y", (datapoint) => 150 - datapoint  ) 
    svgGraph.selectAll('rect')
      .data(performance).exit().remove()
  }

  render(){
    return(
      <div>
      <center>
      <h1>The Graph Will Go Here</h1>
      <div ref="graph"></div>
      </center>
      </div>
    )
  }
}
