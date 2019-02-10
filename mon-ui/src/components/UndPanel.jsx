"use strict"

import React from 'react';
import { AutoSizer, Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
import { Card } from 'react-toolbox/lib/card';
import { CardActions } from 'react-toolbox/lib/card';
import { CardTitle } from 'react-toolbox/lib/card';
import { CardText } from 'react-toolbox/lib/card';
import OpeningMonCell from './OpeningMonCell';
import OpeningMonHeaderCell from './OpeningMonHeaderCell';
import Immutable, {Map, List, fromJS, is } from 'immutable';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styles from './UndPanel.css';
import '../public/css/styles.css';
    
class UndPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changes: {}
    }
    this._sort = this._sort.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: don't update if viewing und detail.
    return true;
  }

  _rowClassNameGetter(rowindex) {
    return 'myrow';
  }

  _sort({sortBy, sortDirection}) {
//    console.log("UndPanel::sort [sortBy=%s, sortDirection=%s]", sortBy, sortDirection);
    
    this.props.actions.sortUnds(sortBy, sortDirection);
  }

  _headerRenderer({ dataKey, label, sortBy, sortDirection }) {
    return (
      <div>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection}/>}
      </div>
    )
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No underlyings.</div>;
  }

  componentWillReceiveProps(nextProps) {
    
    if (!this.props.undsForSelectedExchange || !nextProps.undsForSelectedExchange) {
      console.log("UndPanel::componentWillReceiveProps props not set");
      return;
    }
    let undsOld = this.props.undsForSelectedExchange;
    let undsNew = nextProps.undsForSelectedExchange;

//    console.log("UndPanel::componentWillReceiveProps [undsOld=%s, undsNew=%s]", undsOld, undsNew);

    // mark und as changed if new props have new underlying or und info has changed.

    let foo = {};
    for (let k of undsNew.keys()) {
      if (!undsOld.has(k) || !is(undsNew.get(k), undsOld.get(k))) {
        foo[k]=true;
        console.log("UndPanel::componentWillReceiveProps CHANGE DETECTED [und=%s]", k);
      } 
    }
    this.setState({changes:foo});
  }

  render() {
    console.log("UndPanel::render");
    const sortByUnd = this.props.sortByUnd;
    const sortDirectionUnd = this.props.sortDirectionUnd;
    const { undsForSelectedExchange } = this.props;
    if (!undsForSelectedExchange || this.props.selectedExchange == "") {
      return null;
    }
    
    console.log("UndPanel::render size=%s", undsForSelectedExchange.size);
    const rows = undsForSelectedExchange.toIndexedSeq();
    return (
      <div className={styles.tablewrapper} >
        <AutoSizer onResize={({width, height}) => console.log("onResize")}>
        {({ width, height}) => (
          <div style={{flex: '1 1 auto', width: width, height: '100%'}}>
          <Card style={{flex: '1 1 auto'}}>
{/*            <CardTitle title='Testing'/>
            <CardText>Foobar</CardText>
*/}
          <Table
            rowCount={rows.size}
            rowHeight={30}
            headerHeight={100}
            width={width}
            height={height}
            rowGetter={({index}) => rows.get(index)}
            sort={this._sort}
            sortBy={sortByUnd}
            sortDirection={sortDirectionUnd}
            noRowsRenderer={this._noRowsRenderer}
            rowClassName={
              ({index}) => {
                if (index === -1) {
                  return;
                } else {
                  let undInfo = rows.get(index);

                  // detect changes
                  if (this.state.changes[undInfo.get("name")]) {
                    console.log("CHANGED!!!!!!!!!!!!!!!1");
                    return styles.changed;
                  }
                  // color code rows according to % of options not open
                  if (undInfo.get("percentOptionsNotOpen") > .9) {
                    return index % 2 === 0 ? styles.evenCritical : styles.oddCritical;
                  } else if (undInfo.get("percentOptionsNotOpen") > .1) {
                    return index % 2 === 0 ? styles.evenWarning : styles.oddWarning;
                  }                 
                  return index % 2 === 0 ? styles.evenRow : styles.oddRow
                }
              }
            }
            headerHeight={40}>
            <Column
              dataKey='name'
              label='Name'
              headerRenderer = {this._headerRenderer}
              width={100}/>
            <Column
              dataKey='state'
              label='State'
              headerRenderer = {this._headerRenderer}
              cellRenderer = {({cellData}) => {
                switch(cellData) {
                  case "O":
                    return "Open (O)";
                  case "C":
                    return "Closed (C)";
                  default:
                    return "";
                }
              }}
              width={100}/>
            <Column
              dataKey='totalOptions'
              label='Tot Opts'
              headerRenderer = {this._headerRenderer}
              width={100}/>
            <Column
              dataKey='totalOptionsNotOpen'
              label='Tot Opts Not Open'
              headerRenderer = {this._headerRenderer}
              width={300}/>
           <Column
              dataKey='percentOptionsNotOpen'
              label='% Opts Not Open'
              cellRenderer={({cellData, dataKey, rowData}) => {
                  //return cellData;
                  return rowData.get("percentOptionsNotOpenString");
                }
              }
              headerRenderer = {this._headerRenderer}
              width={300}/>
         </Table>
          </Card>
         </div>
        )}
        </AutoSizer>
      </div>
    );
  }
}
export default UndPanel;
