import React from 'react';
import ExchangePanel from './ExchangePanel';
import UndPanel from './UndPanel';
import UndHeatPanel from './UndHeatPanel';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';

class MonDash extends React.Component {

  constructor(props) {
    super(props);
//    console.log("MonDash:::ctor");
  }

  fetchExchangeData(config) {
    let url=API_URLBASE + "/stats/estats";
    //let url= "stats/estats";
    //console.log("MonDash::fetchExchangeData [url=%s]", url);
    fetch(url, {mode: 'cors'})
      .then(
        function(response) {
          if (response.status !== 200) {
            //console.log('Received non-200 http response [code: ' + response.status + ']');
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

  componentDidMount() {
//    console.log("MonDash::componentDidMount");
    this.props.actions.init(); 
//    console.log("MonDash::invoking api");
    this.timerId = setInterval(
      () => {
        this.fetchExchangeData({callback: this.props.actions.onMessage});
      }, 1000
    );
  }

  render() {
    console.log("MonDash::render");
    console.log("foo:" + this.props.selectedExchange == "");
    console.log("foo:" + this.props.selectedExchange == null);
    console.log("foo [foo=%s]", this.props.selectedExchange);
    if (!this.props.selectedExchange) {
      console.log("here");
    }
    var isExchSelected = this.props.selectedExchange;
    var showGrid = isExchSelected && this.props.showGrid;
    console.log(this.state);
    var exchDetail = () => {
      if (isExchSelected) {

        if (showGrid) {
          return (
            <div style={{flex: '1 1 auto', display: 'flex', flexDirection: 'column'}}>    
            <UndHeatPanel actions={this.props.actions} undsForSelectedExchange={this.props.undsForSelectedExchange} selectedExchange={this.props.selectedExchange}></UndHeatPanel>
            </div>
          )
        } else {
          return (
            <div style={{flex: '1 1 auto', display: 'flex', flexDirection: 'column'}}>    
            <UndPanel actions={this.props.actions} undsForSelectedExchange={this.props.undsForSelectedExchange} sortByUnd={this.props.sortByUnd} sortDirectionUnd={this.props.sortDirectionUnd} selectedExchange={this.props.selectedExchange}></UndPanel>
            </div>
          )
        }
      } else {
        return null;
      }
    }

    return (
      <div id="page-content-wrapper"  style={{paddingLeft: '0px', flex: '1 1 auto', display: 'flex', flexDirection: 'column'}}>
        <ExchangePanel actions={this.props.actions} exchTotsMap={this.props.exchTotsMap} undsForSelectedExchange={this.props.undsForSelectedExchange} selectedExchange={this.props.selectedExchange} showGrid={this.props.showGrid}></ExchangePanel>

        {
          exchDetail()
        }
      </div>
    );
  }
}

export default MonDash;
