"use strict";
import EventEmitter from 'events';
import {ReduceStore} from 'flux/utils';
import Immutable, {Map, List, fromJS} from 'immutable';
var assign = require('object-assign');
const moment = require('moment');
import { SortDirection, SortIndicator } from 'react-virtualized';
import AppDispatcher from '../AppDispatcher'
import ActionTypes from '../actions/ActionTypes';

/**
  * State:
  * groupMap               - Map of firms, portFirmId => PortFirm
  * groupPortMap           - Map of firm details, firm => firmDetail
  * portsForSelectedGroup  - Map of port to port totals for a selected firm, port => ???
  * groupSummaryInfo       - Map of summary info across firms
  * selectedGroup          - Group selected
  * groupSortInfo          - single property value, key is colName, value is asc/desc
  * portSortInfo           - single property value, key is colName, value is asc/desc
  * portEvents             - List of port events
  * latencyStream          - List of latencies
  */
class MonStore extends ReduceStore {
  constructor() {
    console.log("MonStore::ctor");
    super(AppDispatcher);
  }


  getInitialState() {
    return Immutable.fromJS({

      exchTotsMap:                       Map(),
//                                           [exchname] => [exchStats]
      exchUndsMap:                       Map(),
//                                           [exchname] => [undName] => [undStats]
      selectedExchange:                  '',
      undsForSelectedExchange:           Map(),
//                                           [undname] => [undStats]
      sortByUnd:                         'name',
      sortDirectionUnd:                  SortDirection.ASC,
      leftMenuActive:                    false,
      lastTimestamp:                     0,
      lastTimestampString:               "",
      warningNoUpdates:                  false,
      showGrid:                          false,
      config:                            {},
    })
  }
 
  reduce(state, action) {
 //   console.log("MonStore::reduce");
   switch (action.type) {
      case ActionTypes.INITIALIZE:
        console.log("MonStore::reduce [actionType=INITIALIZE]");
        return state;
      case ActionTypes.TOGGLE_SIDE_MENU:
        console.log("MonStore::reduce [actionType=TOGGLE_SIDE_MENU]");
        let active = state.get("leftMenuActive");
        return state.set("leftMenuActive", !active);
      case ActionTypes.CLOSE_SIDE_MENU:
        console.log("MonStore::reduce [actionType=CLOSE_SIDE_MENU]");
        return state.set("leftMenuActive", false);
      case ActionTypes.SORT_EXCHANGES:
        console.log("MonStore::reduce [actionType=SORT_EXCHANGES]");
        return state;
      case ActionTypes.SORT_UNDERLYINGS:
        console.log("MonStore::reduce [actionType=SORT_UNDERLYINGS]");
        if (!state.get("selectedExchange")) {
          console.error("No exchange selected");
          return;
        }

        let selectedExchange = state.get("selectedExchange");
        let undMap = state.get("exchUndsMap").get(selectedExchange);

        let sortCol = action.sortCol;
        let sortDir = action.sortDir;

        undMap = this._onSortChange(undMap, sortCol, sortDir);
        return state.setIn(["exchUndsMap", selectedExchange], undMap).set("undsForSelectedExchange", undMap).set("sortByUnd", sortCol).set("sortDirectionUnd", sortDir);
       
      case ActionTypes.VIEW_EXCHANGE_DETAIL:
//        console.log("reduce::VIEW_EXCHANGE_DETAIL [exchangeCode=%s]", action.exchangeCode);
        state = state.setIn(["selectedExchange"], action.exchangeCode).setIn(["undsForSelectedExchange"], new Map());

        return state;
      case ActionTypes.HEALTH_CHECK:
        let now = new Date();
        let nowInSeconds = now.getSeconds() + (60 * now.getMinutes()) + (60 * 60 * now.getHours());
        if (state.get("lastTimestamp") == 0) {
          return state;
        }
        let lastUpdateInSeconds = state.get("lastTimestamp");

        //console.log("reduce::HEALTH_CHECK [now=%s, last=%s, diff=%s]", nowInSeconds, lastUpdateInSeconds, nowInSeconds - lastUpdateInSeconds);
        let timeSinceLast = nowInSeconds - lastUpdateInSeconds;

        if (timeSinceLast > 10 ) {
          return state.set("warningNoUpdates", true);
        } else {
          return state.set("warningNoUpdates", false);
        }
      case ActionTypes.TOGGLE_EXCHANGE_DETAIL_MODE:
        return state.set("showGrid", action.showGrid);
      case ActionTypes.ON_CONFIG:
        console.log("MonStore::reduce [actionType=%s]", "ON_CONFIG");
        return state;
 
      case ActionTypes.ON_MESSAGE:
//        console.log("MonStore::reduce [actionType=ON_MESSAGE]");

        // Process a batch of messages from upstream:
        // - Update these cache structures:
        // -   exchTotsMap
        // -   exchUndsMap
        // -   undsForSelectedExchange
        // 
        // A batch consists of these message types:
        // - exchange stats
        // - und stats
        //
        // First stage the info in temp structures.
        let newExchUndsMap = new Map().asMutable();

        // update last timestamp
        let lastTimestamp = ( action.msg[0].timestamp / 1000000000 );
        state = state.setIn(["lastTimestamp"], lastTimestamp).setIn(["lastTimestampString"], action.msg[0].timestampString);

        for (var i in action.msg) {
          let msg = action.msg[i]; 


//          console.log("msg [msg=%s]", msg);
          switch(msg.msgType) {
          case 'E':
            // Update exchange tots cache
//            console.log("msg [msg=%s]", msg);
//            console.log( msg);
            state = state.setIn(["exchTotsMap", msg.exchangeCode], 
              fromJS({
                exchangeCode:                  msg.exchangeCode,
                exchangeString:                msg.exchangeString,
                state:                         msg.state,
                totalOptions:                  msg.totalOptions,
                totalOptionsOpen:              msg.totalOptionsOpen,
                totalOptionsNotOpen:           msg.totalOptionsNotOpen,
                totalUnds:                     msg.totalUnds,
                totalUndsOpen:                 msg.totalUndsOpen,
                totalUndsNotOpen:              msg.totalUndsNotOpen,
                percentUndsNotOpen:            msg.percentUndsNotOpen,
                percentOptionsNotOpen:         msg.percentOptionsNotOpen,
                percentUndsOpen:               msg.percentUndsOpen,
                percentUndsOpenString:         msg.percentUndsOpenString,
                percentOptionsOpen:            msg.percentOptionsOpen,
                percentOptionsOpenString:      msg.percentOptionsOpenString
              })
            );
            break;
          case 'U':
            if (!newExchUndsMap.has(msg.exchangeCode)) {
              newExchUndsMap.set(msg.exchangeCode, new Map().asMutable());
            }
            newExchUndsMap.setIn([msg.exchangeCode, msg.name], fromJS({
              name:                            msg.name,
              state:                           msg.state,
              totalOptions:                    msg.totalOptions,
              totalOptionsNotOpen:             msg.totalOptionsNotOpen,
              totalOptionsOpen:                msg.totalOptionsOpen,
              percentOptionsNotOpen:           msg.percentOptionsNotOpen,
              percentOptionsNotOpenString:     msg.percentOptionsNotOpenString
            }));
            break;
          default:
            break;
          }
        }

        state = state.setIn(["exchUndsMap"], state.get("exchUndsMap").mergeDeep(newExchUndsMap));

        //newExchUndsMap = newExchUndsMap.mergeDeep(state.get("exchUndsMap"));
       // if (state.hasIn(["exchUndsMap", "I", "MO"])) {
       //   console.log("exchUndsMap[name=%s, status=%s]", "MO", state.getIn(["exchUndsMap", "I", "MO", "state"]));
       // }

        sortCol = state.get("sortByUnd");
        sortDir = state.get("sortDirectionUnd");

//        console.log("sorted:" + newExchUndsMap.toIndexedSeq());
      
        selectedExchange = state.get("selectedExchange"); 
        var isModal = selectedExchange != "";
 
        // update selected unds
        if (isModal) {
          let sorted = this._onSortChange(state.getIn(["exchUndsMap", selectedExchange]).asImmutable(), sortCol, sortDir);
          
//          console.log("sorted:" + sorted.toIndexedSeq());
          state = state.setIn(["exchUndsMap", selectedExchange], sorted.asImmutable());

        }
        // convert mutable back to immutable
        //for (let k of newExchUndsMap.keys()) {
        //  newExchUndsMap = newExchUndsMap.set(k, newExchUndsMap.get(k).asImmutable());
       // }
   

         
        state = state.set("undsForSelectedExchange", state.getIn(["exchUndsMap", selectedExchange]));
        //if (isModal && state.hasIn(["undsForSelectedExchange", "MO"])) {
        //  console.log("und stats [name=%s, status=%s]", "MO", state.get("undsForSelectedExchange").get("MO").get("state"));
        //}
        return state;
      default:
        return state;
    }
  }

  _onSortChange(collection, colKey, colDir) {
    //console.log("MonStore:_onSortChange [colKey=%s, colDir=%s]", colKey, colDir);

    let sorted = collection.sortBy(
      (v, k) => {
        return v.get(colKey);
      },
      (a, b) => {
        let result = 0;
        if ( a < b ) {
          result = -1;
        } else if ( a == b ) {
          result = 0;
        } else {
          result = 1;
        }
        if (result !== 0 && colDir === SortDirection.DESC) {
          result *= -1;
        }
        return result;
      }
    );
    return sorted;
  }

}

export default new MonStore();
