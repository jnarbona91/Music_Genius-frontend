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
    const colorScale = d3.scaleOrdinal(["#158E9C", "#159C40", "#003A68", "#D68C0A", 
    "#410E6B", "#9C1515"]);
    const { eng, exc, int, rel, foc, str } = this.props
    let performance = [
      {
       label: 'eng',
       data:   eng       
      },
      {
        label: 'exc',
        data:   exc       
       },
       {
        label: 'int',
        data:   int       
       },
       {
        label: 'rel',
        data:   rel      
       },
       {
        label: 'foc',
        data:   foc       
       },
       {
        label: 'str',
        data:   str       
       },
    ]
    const svgGraph = d3.select(this.refs.graph)
      .append("svg")
      .attr("width", 500)
      .attr("height", 200)
      .attr('preserveAspectRatio','xMinYMin')

    const xScale = d3.scaleBand()
      .range([0, 500])
      .domain(performance.map(d => d.label))
      .padding(1)

    svgGraph.append('g')
      .attr('class', 'axis x')
      .attr('transform', 'translate(25, 160)')
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('dy', null)
      .attr("transform", "translate(0, 10)")  
      
    const yScale = d3.scaleLinear()
      .range([150, 0])
      .domain([0, 1.0])
   
    svgGraph.append('g')
      .attr('class', 'axis y')
      .attr('transform', 'translate(25, 10)')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr("transform", "translate(0, 0)rotate(0)")
    
    const yGridlines = d3.axisLeft()
      .scale(yScale)
      .ticks(9)
      .tickSize(-480,0)
      .tickFormat('')
  
    svgGraph.append('g')
      .attr('opacity', 0.3)
      .attr('transform', 'translate(25, 10)')
      .call(yGridlines)
      .classed('gridline')
    
    svgGraph.selectAll("rect")
      .data(performance).enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", (d) => yScale(0) -yScale(d.data))
        .attr("fill", (d, i)=> colorScale(i))
        .attr("x", d => xScale(d.label))
        .attr("y", d => yScale(d.data))
        .attr('transform', 'translate(17, 10)')
    svgGraph.selectAll('rect')
      .data(performance).exit().remove()
      console.log(performance)
  }

  render(){
    return(
      <div>
      <center>
      <h1>Performance Graph</h1>
      <div ref="graph"></div>
      </center>
      </div>
    )
  }
}
