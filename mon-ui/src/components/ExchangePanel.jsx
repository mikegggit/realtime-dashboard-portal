"use strict"

import React from 'react';
import UndPanel from './UndPanel';
//import styles from './public/css/ExchangePanel.css'
import Exchange from './Exchange'; 
class ExchangePanel extends React.Component {

  constructor(props) {
    super(props);
    this.startPolling = this.startUndPoll.bind(this);
    this.startConfigPoll = this.startConfigPoll.bind(this);
    this.handleExchangeClick = this.handleExchangeClick.bind(this);
    this.undTimer = null;
    this.configTimer = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // manage timers
//    console.log("ExchangePanel::shouldComponentUpdate [selectedExchange=%s]", this.props.selectedExchange); 
//    console.log("ExchangePanel::shouldComponentUpdate [nextState.selectedExchange=%s]", nextProps.selectedExchange);


    // (re)establish timers on selecting a new exchange
    if (this.props.selectedExchange != nextProps.selectedExchange) {
      console.log("Detected new exchange selected [exchPrev=%s, exchNext=%s, timer=%s]", this.props.selectedExchange, nextProps.selectedExchange, this.undTimer);
      clearInterval(this.undTimer);
      this.startUndPoll(nextProps.selectedExchange);
      
      clearInterval(this.configTimer);
      this.startConfigPoll(nextProps.selectedExchange);
    }
    return true;
  }

  _rowClassNameGetter(rowindex) {
    return 'myrow exchange-table-row';
  }

  fetchUndData(config) {
    let url=API_URLBASE + "/stats/ustats?exchange=" + config.exchange;
    //let url="stats/ustats?exchange=" + config.exchange;
    console.log("ExchangePanel::fetchUndData [url=%s]", url);
//    console.log("ExchangePanel::fetchUndData [config=%s]", config);
    fetch(url, {mode: 'cors'})
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Received non-200 http response [code: ' + response.status + ']');
            return;
          }
          response.json().then(function(data) {
//            console.log(data);
            config.callback(data);
          });
        }
      )
      .catch(function(e) {
        console.log("Fetch Error", e);
      });
  }

  startUndPoll(exchange) {
    this.undTimer = setInterval(
      () => {
        this.fetchUndData(
          {
            callback: this.props.actions.onMessage,
            exchange: exchange
          });
      }, 1000
    );
  }
  fetchConfig(config) {
    //let url=API_URLBASE + "/config?exchange=" + config.exchange;
    let url="config?exchange=" + config.exchange;
    console.log("ExchangePanel::fetchConfig [url=%s]", url);
    fetch(url, {mode: 'cors'})
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Received non-200 http response [code: ' + response.status + ']');
            return;
          }
          response.json().then(function(data) {
//            console.log(data);
            config.callback(data);
          });
        }
      )
      .catch(function(e) {
        console.log("Fetch Error", e);
      });
  }


  startConfigPoll(exchange) {
    console.log("ExchangePanel::startConfigPoll [exchange=%s]", exchange);
    this.confTimer = setInterval(
      () => {
        this.fetchConfig({
          callback: this.props.actions.onConfig, 
          exchange: exchange
       }); 
      }, 30000
    );
  }

  openExchangeDetail(e, exchangeCode) {
//    console.log("ExchangePanel::openExchangeDetail");
    // Kill any existing und poll
    if (this.undTimer != null) {
      console.log("Cancelling und timer...");
      clearInterval(this.undTimer);
    }
    this.startUndPoll();
    this.props.actions.startUndPoll(exchangeCode);
  }

  close() {
//    console.log("ExchangePanel::close");
//    this.setState({ showModal: false});
    clearInterval(this.undTimer);
    this.props.actions.closeUndModal();
  }

  handleExchangeClick(exchangeCode) {
    console.log("handleExchangeClick [exchangeCode=%s]", exchangeCode);
    this.props.actions.clickExchangeRow(exchangeCode);
  }

  render() {
    const { exchTotsMap } = this.props;
    let data = exchTotsMap.toIndexedSeq();
    
    const exchangeItems = data.map((exch) =>
      <Exchange actions={this.props.actions} key={exch.get("exchangeCode")} selectedExchange={this.props.selectedExchange} exchangeInfo={exch} onClick={this.handleExchangeClick} showGrid={this.props.showGrid}></Exchange>);

    return (
      
      <div style={{display: 'flex', flexDirection: 'row', maxHeight: '150px'}}>
        { exchangeItems }
      </div>
    );
  }

}
export default ExchangePanel;
