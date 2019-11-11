import React from 'react'
import * as d3 from 'd3'

export default class Graph extends React.Component{
  componentDidMount(){
    const { eng, exc, str, rel, int, foc, } = this.props
    const performanceMetrics = [ eng, 60, exc, 60, str, 60, rel, 60, int, 60, foc, 60]
    this.drawBarChart(performanceMetrics)
  }

  componentDidUpdate(prevProps){
    const { eng, exc, str, rel, int, foc, } = this.props
    const currentProps = [ eng, exc, str, rel, int, foc]
    console.log(prevProps)
    if(prevProps !== currentProps){
      this.drawBarChart(currentProps)
    }
  }

  drawBarChart(performanceMetrics){
    const svgGraph = d3.select(this.refs.graph)
      .append("svg")
      .attr("width", 500)
      .attr("height", 150)
      .style("border", "1px solid black")
    svgGraph.selectAll("rect")
      .data(performanceMetrics).enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", (datapoint) => datapoint * 1000)
        .attr("fill", "gray")
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
