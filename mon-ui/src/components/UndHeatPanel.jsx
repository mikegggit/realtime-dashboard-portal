"use strict"

import React from 'react';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { AutoSizer } from 'react-virtualized';
import { Card } from 'react-toolbox/lib/card';
import { CardActions } from 'react-toolbox/lib/card';
import { CardTitle } from 'react-toolbox/lib/card';
import { CardText } from 'react-toolbox/lib/card';
import Immutable, { Map, List, fromJS, is } from 'immutable';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styles from './UndHeatPanel.css';
import '../public/css/styles.css';
    
class UndHeatPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewportWidth: 800,
      viewportHeight: 10000,
      data: ""
    };
    this.checkThermostat = this.checkThermostat.bind(this);
  }

  componentDidMount() {
    this.checkThermostat();
  }

  componentDidUpdate() {
    this.checkThermostat();
  }

  //shouldComponentUpdate(nextProps, nextState) {
    // TODO: don't update if viewing und detail.
    //return true;
  //}

  
  componentWillReceiveProps(nextProps) {
  }

  checkThermostat() {
    console.time("UndHeatPanel::checkThermostat");

    var data = this.props.undsForSelectedExchange;
    if (data == null) {
      return;
    }
    var x = 0;
    var y = 0;
    var pctOpen = 0;
    var pctClosed = 0;
    var width = 60;
    var height = 30;
    var padding = 4;
    var state = "";
    var symbolsPerRow = Math.floor(this.state.viewportWidth / (width + padding));
    var index = 0;
    var totOpts = 0;
    var totOptsOpen = 0;
    var data = data
      // This may already be filtered out in mt...
      .filter(s => s.get("totalOptions") > 0)
      .map( (s) => {
      x = (index % symbolsPerRow) * (width + padding);
      y = Math.floor(index / symbolsPerRow) * (height + padding);
      index++;
      totOpts = s.get("totalOptions");
      totOptsOpen = s.get("totalOptionsOpen"); 
      pctClosed = s.get("percentOptionsNotOpen");
      pctOpen = 100 - pctClosed;
      state = s.get('state');
      return {name: s.get("name"), state: state,x: x, y: y, width: width, height: height, totOpts: totOpts, totOptsOpen:totOptsOpen, pctOpen: pctOpen, pctClosed: pctClosed}
    }).toArray();
 
    const node = this.node;
   
    var div = select("body").select("#tooltip");
    var svgContainer = select(node);

    svgContainer
    .attr('height', y + height + padding);

    var symbolg =
      svgContainer
        .selectAll('g')
        .data(data);

    var enter = symbolg
      .enter()
      .append('g');

    enter
      .append('rect')
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('fill', 'red')
      .merge(symbolg)
      .select('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y);

    enter
      .append('rect')
      .classed("pct", true)
      .attr('width', d => d.width * (d.pctOpen / 100))
      .attr('height', d => d.height)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('fill', 'limegreen')
      .merge(symbolg)
      .select("rect.pct")
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width * (d.pctOpen / 100));

    enter
      .append('circle')
      .attr("cx", d => d.x + 6)
      .attr("cy", d => d.y + (d.height - 6))
      .attr("r", 4)
      .style("fill", d => {
        return d.state == "O" ? "blue" : "red";
      })
      .merge(symbolg)
      .select('circle')
      .attr("cx", d => d.x + 6)
      .attr("cy", d => d.y + (d.height - 6))
      .style("fill", d => {
        return d.state == "O" ? "blue" : "red";
      });

    enter
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', d => d.x + d.width / 2)
      .attr('y', d => d.y + d.height /2 + 4)
      .attr('font-family', "Roboto")
      .attr('fill', 'white')
      .text(d => d.name)
      .merge(symbolg)
      .select('text')
      .attr('x', d => d.x + d.width / 2)
      .attr('y', d => d.y + d.height /2 + 4);

    enter
      .append('rect')
      .classed("overlay", true)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('opacity', 0)
      .style("cursor", 'pointer')
      .on("mouseover", function(d) {
       div
         .transition()
         .duration(200)
         .style("opacity", .9);
      div.html(
         d.name + "(" + d.state + ")</br>" + (d.pctOpen).toFixed(1) + "% open</br>(" + d.totOptsOpen + " of " + d.totOpts + ")")
         .style("left", event.offsetX+ "px")
         .style("top", event.offsetY+ "px");
      })
      .on("mouseout", function(d) {
        div.transition()
        .duration(500)
        .style("opacity", 0);
      })
      .merge(symbolg)
      .select("rect.overlay")
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .on("mouseover", function(d) {
         var heatScroller = document.getElementById("heatScroller");
         div.transition()
           .duration(200)
           .style("opacity", .9);
         div.html(
            d.name + "(" + d.state + ")</br>" + (d.pctOpen).toFixed(1) + "% open</br>(" + d.totOptsOpen + " of " + d.totOpts + ")")
           .style("left", event.offsetX+ "px")
           .style("top", (event.offsetY - heatScroller.scrollTop)+ "px");
      });
    symbolg.exit().remove();
    console.timeEnd("UndHeatPanel::checkThermostat");
  }

  render() {
    console.log("UndHeatPanel::render");
    const sortByUnd = this.props.sortByUnd;
    const sortDirectionUnd = this.props.sortDirectionUnd;
    const { undsForSelectedExchange } = this.props;
    if (!undsForSelectedExchange || this.props.selectedExchange == "") {
      return null;
    }
    
    console.log("UndHeatPanel::render size=%s", undsForSelectedExchange.size);
    const rows = undsForSelectedExchange.toIndexedSeq();
    return (
      <div className={styles.tablewrapper} >
        <AutoSizer 
           onResize={({width, height}) => {
             console.log("onResize [width=%s, height=%s, this.state.viewPortWidth=%s]", width, height, this.state.viewportWidth);
             this.setState({viewportWidth: width});
             this.checkThermostat();
           }}>
          
        {({ width, height}) => (
          
          <div id="heatScroller" style={{width: width, height: height, overflow: 'scroll'}}>
          <Card style={{flex: '1 1 auto'}}>
            <svg ref={node => this.node = node}
              style={{backgroundColor: 'black', flex: '1 1 auto'}} height={height} width={width}>
            </svg>
            <div className={styles.tooltip} id="tooltip"/>
          </Card>
         </div>
        )}
        </AutoSizer>
      </div>
    );
  }
}
export default UndHeatPanel;
