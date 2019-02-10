"use strict"

import React from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'react-toolbox/lib/card';
import { CardActions } from 'react-toolbox/lib/card';
import { CardTitle } from 'react-toolbox/lib/card';
import { CardText } from 'react-toolbox/lib/card';
import { Layout } from 'react-toolbox/lib/layout';
import { Panel } from 'react-toolbox/lib/layout';
import { Button } from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';

var sprintf = require('sprintf-js').sprintf
import styles from './Exchange.css';

class Exchange extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    //this.handleExchDetailModeToggle = this.handleExchDetailModeToggle.bind(this);
  }

  onClick() {
    let exchangeCode = this.props.exchangeInfo.get("exchangeCode");
    console.log("Exchange::onClick [exchange=%s]", exchangeCode);

    this.props.onClick(exchangeCode);
  } 

  toggleShowGrid(field, value) {
    console.log("Exchange::toggleShowGrid [showGrid=%s]", value);
    this.props.actions.toggleShowGrid(value);
    //this.setState({...this.state, [field]: value});
  }

  render() {
    const { exchangeInfo } = this.props;
    const exchangeCode            = exchangeInfo.get("exchangeCode");
    const state                   = exchangeInfo.get("state");
    const totalOptions            = exchangeInfo.get("totalOptions");
    const totalOptionsOpen        = exchangeInfo.get("totalOptionsOpen");
    const totalOptionsNotOpen     = exchangeInfo.get("totalOptionsNotOpen");
    const totalUnds               = exchangeInfo.get("totalUnds");
    const totalUndsOpen           = exchangeInfo.get("totalUndsOpen");
    const totalUndsNotOpen        = exchangeInfo.get("totalUndsNotOpen");
    const percentUndsNotOpen      = exchangeInfo.get("percentUndsNotOpen");
    const percentOptionsNotOpen   = exchangeInfo.get("percentOptionsNotOpen");
    const percentUndsOpen         = exchangeInfo.get("percentUndsOpen");
    const percentUndsOpenString   = exchangeInfo.get("percentUndsOpenString");
    const percentOptionsOpen      = exchangeInfo.get("percentOptionsOpen");
    const percentOptionsOpenString= exchangeInfo.get("percentOptionsOpenString");

    let exchangeString;
    switch(exchangeCode) {
      case 'A':
        exchangeString="AMEX";
        break;
      case 'N':
        exchangeString="NSDQ";
        break;
      case 'C':
        exchangeString="CBOE";
        break;
      case 'Y':
        exchangeString="NYSE";
        break;
      case 'B':
        exchangeString="BATS";
        break;
      case 'M':
        exchangeString="MIAX";
        break;
    }
    // Alarms
    // This impl depends on client and server clocks being 
    // roughly in synch.
    let opening = new Date();
    opening.setHours(9);
    opening.setMinutes(30);
    opening.setSeconds(0);    
   
    let now = new Date(); 

    let minutesAfterOpening = (now.getTime() - opening.getTime()) / 1000 / 60;
    let preopen = false;
    let critical = false;
    let warning = false;
 
 
    if ( minutesAfterOpening > 30 ) {
      if ( percentOptionsOpen < 100 ) {
        critical = true;        
      }
    } else if ( minutesAfterOpening > 10 ) {
      if ( percentOptionsOpen < 90 ) {
        critical = true;
      }
    } else if ( minutesAfterOpening > 5 ) {
      if ( percentOptionsOpen < 75 ) {
        critical = true;
      } 
    } else if (minutesAfterOpening < 0 ) {
      preopen = true; 
    }
   
    //console.log("exchangeString=%s, exchangeCode=%s", exchangeString, exchangeCode);
 
    let title = exchangeString + "(" + exchangeCode + ")> " + (preopen ? "Pre-Open" : (state == "O" ? "Open" : "Closed"));
    let undSummary = sprintf('%1$-5s %2$-5s (%3$5i of %4$5i)', 'Unds:', percentUndsOpenString, totalUndsOpen, totalUnds);
    let optSummary = sprintf('%1$-5s %2$-5s (%3$5i of %4$5i)', 'Opts:', percentOptionsOpenString, totalOptionsOpen, totalOptions);


    return (
      <Card className={
        (() => {
          if (critical) {
            return styles.critical;
          } else if (preopen) {
            return styles.preopen;
          } else {
            return styles.normal;
          }
        })()} >
        <CardTitle
          title={title}
          style={{fontSize: '30px', fontWeight: 'bold',color: 'white'}}
        />
        <CardText className={styles.summaryStatsRow}>{undSummary}</CardText>
        <CardText className={styles.summaryStatsRow}>{optSummary}</CardText>
        <CardActions>
        {
          (() => {
            if (exchangeCode == this.props.selectedExchange) {
              return <Button icon="check_box" label="Detail" />
            } else {
              return <Button icon="check_box_outline_blank" label="Detail" onMouseUp={this.onClick} />
            }
          })()
        }
        {
          (() => {
            if (exchangeCode != this.props.selectedExchange) {
              return null;
            }
            return <section style={{height: '26px'}}>
              <Switch
                checked={this.props.showGrid}
                label="grid"
                onChange={this.toggleShowGrid.bind(this, 'showGrid')}
              />
            </section>
          })()
        }        
        </CardActions>
      </Card>  
    );
  }
}

export default Exchange;
