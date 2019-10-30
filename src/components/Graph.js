import React from 'react'
import * as d3 from 'd3'

export default class Graph extends React.Component{
  componentDidMount(){
    const performanceMetrics = [ 10, 22, 50, 90]
    this.drawBarChart(performanceMetrics)
  }
  drawBarChart(performanceMetrics){
    const svgGraph = d3.select(this.refs.graph)
      .append("svg")
      .attr("width", 300)
      .attr("height", 150)
      .style("border", "1px solid black")
    svgGraph.selectAll("rect")
      .data(performanceMetrics).enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", (datapoint) => datapoint)
        .attr("fill", "blue")
        .attr("x", (datapoint, iteration) => iteration * 40)
        .attr("y", (datapoint) => 150 - datapoint  )
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
