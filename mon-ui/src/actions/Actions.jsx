import ActionTypes from './ActionTypes';
import AppDispatcher from '../AppDispatcher'

const Actions = {
  init() {
    console.log("Actions::initialize");
    AppDispatcher.dispatch({
      type: ActionTypes.INITIALIZE,
    });
  },
  toggleSideMenu() {
    console.log("Actions.toggleSideMenu");
    AppDispatcher.dispatch({
      type: ActionTypes.TOGGLE_SIDE_MENU,
    });
  },
  sortExch(sorted, sortCol, sortDir) {
    console.log("Actions::sortExch [sortCol=%s, sortDir=%s]", sortCol, sortDir);
    AppDispatcher.dispatch({
      type:    ActionTypes.SORT_EXCHANGES,
      rows:    sorted,
      sortCol: sortCol,
      sortDir: sortDir,
    });
  },
  sortUnds(sortCol, sortDir) {
    console.log("Actions::sortUnds [sortCol=%s, sortDir=%s]", sortCol, sortDir);
    AppDispatcher.dispatch({
      type:    ActionTypes.SORT_UNDERLYINGS,
      sortCol: sortCol,
      sortDir: sortDir
    });
  },
  clickExchangeRow(exchangeCode) {
    console.log("Actions::clickExchangeRow [exchangeCode=%s]", exchangeCode);
    AppDispatcher.dispatch({
      type:                      ActionTypes.VIEW_EXCHANGE_DETAIL,
      exchangeCode:              exchangeCode,
    });
  },
  onMessage(msg) {
//    console.log("Actions::onMessage");
    AppDispatcher.dispatch({
      type: ActionTypes.ON_MESSAGE,
      msg:  msg
    });
  },
  onConfig(cfg) {
    console.log("Actions::onConfig");
    AppDispatcher.dispatch({
      type: ActionTypes.ON_CONFIG,
    });
  },
  healthCheck() {
//    console.log("Actions::healthCheck");
    AppDispatcher.dispatch({
      type: ActionTypes.HEALTH_CHECK
    });
  },
  toggleExchangeDetailMode(showGrid) {
    AppDispatcher.dispatch({
      type: ActionTypes.TOGGLE_EXCHANGE_DETAIL_MODE,
      showGrid: showGrid
    });
  }
};

export default Actions;
