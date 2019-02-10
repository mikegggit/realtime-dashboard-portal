import React from 'react';
import {Cell} from 'fixed-data-table-2'
import SortDir from './SortDir';

import styles from './OpeningMonHeaderCell.css';
/*
 * Supports sorting. 
 *
 * props:
 * sortCol
 * sortDir
 * onSortChange
 */
class OpeningMonHeaderCell extends React.Component{
  constructor(props) {
    super(props);
//    console.log("OpeningMonHeaderCell::ctor");
    this._onSortChange = this._onSortChange.bind(this) 
  }

  reverseSortDirection(sortDir) {
    return sortDir === SortDir.DESC ? SortDir.ASC : SortDir.DESC;
  }

  _onSortChange(e) {
    console.log("OpeningMonHeaderCell::_onSortChange");
    e.preventDefault();
       
    const {onSortChange, columnKey, sortDir} = this.props; 
    
    onSortChange(
      columnKey, 
      this.props.sortDir ?
        this.reverseSortDirection(this.props.sortDir) :
        SortDir.ASC);
  }

  render() {
    //console.log("OpeningMonHeaderCell::render");
    var { children, sortDir } = this.props;
    return (<Cell className="sortable-header" >
      <a onClick={this._onSortChange}>{children} { sortDir ? (sortDir === SortDir.ASC) ? String.fromCharCode( "9650") : String.fromCharCode("9660") : '' }</a>
    </Cell>); 

  }
}

export default OpeningMonHeaderCell;
