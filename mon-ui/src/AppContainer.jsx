import React from 'react';
import { Container } from 'flux/utils';
import { Layout } from 'react-toolbox/lib/layout';
import { Panel } from 'react-toolbox/lib/layout';
import { NavDrawer } from 'react-toolbox/lib/layout';
import MonAppBar from './components/MonAppBar';
import MonStore from './stores/MonStore';
import MonDash from './components/MonDash';
import Actions from './actions/Actions';
import MonSidebar from './components/MonSidebar';
import styles from './AppContainer.css';
import './Globals.css';

class AppContainer extends React.Component {
  static getStores() {
    console.log("AppContainer::getStores");
    return [
      MonStore
    ];
  }
  static calculateState(prevState) {
//    console.log("AppContainer::calculateState");
    return {
      exchTotsMap:                 MonStore.getState().get("exchTotsMap"),
      exchUndsMap:                 MonStore.getState().get("exchUndsMap"),
      selectedExchange:            MonStore.getState().get("selectedExchange"),
      undsForSelectedExchange:     MonStore.getState().get("undsForSelectedExchange"),
      sortByUnd:                   MonStore.getState().get("sortByUnd"),
      sortDirectionUnd:            MonStore.getState().get("sortDirectionUnd"),
      leftMenuActive:              MonStore.getState().get("leftMenuActive"),
      lastTimestamp:               MonStore.getState().get("lastTimestamp"),
      lastTimestampString:         MonStore.getState().get("lastTimestampString"),
      warningNoUpdates:            MonStore.getState().get("warningNoUpdates"),
      showGrid:                    MonStore.getState().get("showGrid"),

      actions: {
        init:                      Actions.init,
        sortUnds:                  Actions.sortUnds,
        clickExchangeRow:          Actions.clickExchangeRow,
        onMessage:                 Actions.onMessage,
        toggleSideMenu:            Actions.toggleSideMenu,
        healthCheck:               Actions.healthCheck,
        toggleShowGrid:            Actions.toggleExchangeDetailMode

      },
    };
  }

    

  componentDidMount() {
    this.healthTimer = setInterval(
      () => {
        this.state.actions.healthCheck();
      }, 5000
    );
  }

  render(props) {
//    console.log("AppContainer::render [leftMenuActive=%s]", this.state.leftMenuActive);
//    console.log("AppContainer::render");
//    console.log(this.state.lastTimestampString);
    return (
      <Layout>
        <div className={styles.ContentBox}
          style={{
            height: 400
          }}>
        <MonSidebar actions={this.state.actions} active={this.state.leftMenuActive}></MonSidebar>
        <Panel
          style={{
              flex: '1 1 auto',
              display: 'flex',
              height: '100%',
              flexDirection: 'column'
            }} bodyScroll={true}>

          <MonAppBar warningNoUpdates={this.state.warningNoUpdates} lastTimestampString={this.state.lastTimestampString} actions={this.state.actions} />
          <MonDash actions={this.state.actions} exchTotsMap={this.state.exchTotsMap} undsForSelectedExchange={this.state.undsForSelectedExchange} selectedExchange={this.state.selectedExchange} sortByUnd={this.state.sortByUnd} sortDirectionUnd={this.state.sortDirectionUnd} showGrid={this.state.showGrid}></MonDash>
        </Panel>
        </div>
      </Layout>
    );
  }
}
export default Container.create(AppContainer);
