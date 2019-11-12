import React from 'react'
import * as d3 from 'd3'
import { updateExpression } from '@babel/types';
import { selector } from 'postcss-selector-parser';

export default class Graph extends React.Component{
  constructor(props){
    super(props)
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
      .attr("height", 150)
      .style("border", "1px solid black")
    svgGraph.selectAll("rect")
      .data(performance).enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", (datapoint) => datapoint * 1000)
        .attr("fill", "gray")
        .attr("x", (datapoint, iteration) => iteration * 40)
        .attr("y", (datapoint) => 150 - datapoint  )
    svgGraph.selectAll('rect')
      .data(performance).exit().remove()
  }

  render(){
    return(
      <div>
      <h1>The Graph Will Go Here</h1>
      <div ref="graph"></div>
      </div>
    )
  }
}
