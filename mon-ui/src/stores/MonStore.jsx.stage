"use strict";
import EventEmitter from 'events';
//import {assign} from 'object-assign';
var assign = require('object-assign');
import ActionTypes from '../actions/ActionTypes';
import {ReduceStore} from 'flux/utils';
import AppDispatcher from '../AppDispatcher'
import Immutable, {Map, List, fromJS} from 'immutable';
import FirmApi from '../api/FirmApi'
import FirmDetail from '../api/FirmDetail'
import SortDir from '../components/SortDir'
const moment = require('moment');

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
class FirmStore extends ReduceStore {
  constructor() {
//    console.log("FirmStore::ctor");
    super(AppDispatcher);
  }


  getInitialState() {
    return Immutable.fromJS({
      groupMap:              Map(),
      portsForSelectedGroup: Map(),
      groupPortMap:          Map(),
      groupSortInfo:         {last:SortDir.ASC},
      portSortInfo:          {last:SortDir.ASC},
      portEvents:            List(), 
      groupSummaryInfo:      Map()
                               .set("last", "00:00:00.000")
                               .set("totQuotes", 0)
                               .set("totBlocks", 0)
                               .set("totPurges", 0)
                               .set("totUndPurges", 0),
      selectedGroup:         '',
      latencyStream:         List(),
    })
  }
 
  reduce(state, action) {
 //   console.log("FirmStore::reduce");
   switch (action.type) {
      case ActionTypes.INITIALIZE:
        console.log("INITIALIZE");
        return state;
      case ActionTypes.ON_PORT_UPDATE:
//        console.log("ON_PORT_UPDATE");
        
        // reset changed flag
        let currentGroupMap  = state.get("groupMap");
        currentGroupMap = currentGroupMap.map( f => f.set("changed", false));

        let event = action.firm;
        let firmName = event.firm;
       
        let eventMap = Map(event); 
	let entry = Map().set(firmName, eventMap);

        let nextFirms = currentGroupMap.mergeDeep(
          entry
        );
        
        if (!currentGroupMap.equals(nextFirms)) {
//          console.log("state changed"); 
            nextFirms = nextFirms.set(event.firm, nextFirms.get(event.firm).set("changed", true));
        }

        // GROUP => PORTS 
        let curGroupPortMap = state.get("groupPortMap");
        let curPortsForFirm = curGroupPortMap.get(firmName);

        entry = Map().set(           
          event.port, 
	  eventMap.set("changed", false)
        );

        let nextPortsForFirm = curPortsForFirm.mergeDeep(
          entry
        );

        let nextGroupPortMap = curGroupPortMap.mergeDeep(
          Map().set(
            firmName,
            nextPortsForFirm
          )
        );
        
      
         
        let showingPortMap = state.get("selectedGroup");
 
        if (showingPortMap) {
          // user has a firm selected
          let selectedGroup = state.get("selectedGroup");

          // update ports if user is viewing same group just updated
          if (selectedGroup == firmName) {
	    // update his ports w/ global cache
	    state = state.set("portsForSelectedGroup", nextGroupPortMap.get(selectedGroup));
          }
        }

        let groupSummaryInfo = state.get("groupSummaryInfo");

        let totQuotes = parseInt(groupSummaryInfo.get("totQuotes")) + event.quotes;
        let totBlocks = parseInt(groupSummaryInfo.get("totBlocks")) + event.blocks;
        let totPurges = parseInt(groupSummaryInfo.get("totPurges")) + event.purges;
        let totUndPurges= parseInt(groupSummaryInfo.get("totUndPurges")) + event.undPurges;

        state = state.set("groupSummaryInfo", Map()
              .set("last", event.last)
              .set("totQuotes", totQuotes)
              .set("totBlocks", totBlocks)
              .set("totPurges", totPurges)
              .set("totUndPurges", totUndPurges)
        );

        return state.mergeDeep(
          fromJS({
            "groupMap":nextFirms,
            "groupPortMap": nextGroupPortMap,
          })
        );
      case ActionTypes.SORT_GROUPS:
        console.log("FirmStore::reduce [actionType=SORT_GROUPS]");
        console.log("sortCol=%s, sortDir=%s", action.sortCol, action.sortDir);
        let sorted=action.rows;
        console.log(sorted);
        let sortCol = action.sortCol;
        let sortDir = action.sortDir;
        return state.set("groupMap", sorted).set("groupSortInfo", Map({ [sortCol]:sortDir }));
      case ActionTypes.SORT_PORTS:
        console.log("FirmStore::reduce [actionType=SORT_PORTS]");
        console.log("sortCol=%s, sortDir=%s", action.sortCol, action.sortDir);
        console.log(state);

        if (!state.get("selectedGroup")) {
          console.error("No group selected");
          return;
        }
       
        selectedGroup = state.get("selectedGroup");
        console.log(selectedGroup); 
        let portMap = state.get("groupPortMap").get(selectedGroup);

        ({sortCol, sortDir} = action);
        portMap = this._onSortChange(portMap, sortCol, sortDir);

        state = state.setIn(["groupPortMap", selectedGroup], portMap)
        return state.set("portsForSelectedGroup", portMap).set("portSortInfo", Map({ [sortCol]:sortDir }));
      case ActionTypes.ON_SELECT_GROUP:
        console.log("FirmStore::reduce [actionType=ON_SELECT_GROUP]");
	let sequencedGroups = state.get("groupMap").keySeq();
	let selectedGroup = sequencedGroups.get(action.rowIndex);
        console.log("selectedfirm - %s", selectedGroup); 
        portMap = state.get("groupPortMap").get(selectedGroup);         
        state = state.set("selectedGroup", sequencedGroups.get(action.rowIndex));
        return state = state.set("portsForSelectedGroup", portMap);
      case ActionTypes.CLOSE_PORTS:
        return state.set("selectedGroup", '').set("portsForSelectedGroup", Map());
      case ActionTypes.ON_WS_MESSAGE:
        console.log("FirmStore::reduce [actionType=ON_WS_MESSAGE]");
        switch(action.msg.msgType) {
          case 'P':
            console.log("Port Activity");
            return this.onPortActivity(state, action.msg);
            break;
          case 'C':
            console.log("Port Connection Event");
            return this.onPortConnectionEvent(state, action.msg);
            break;
          case 'M':
            console.log("Port Maint");
            return this.onPortMaint(state, action.msg);
            break;
        }
        return state;
      default:
        return state;
    }
  }

  onPortConnectionEvent(state, msg) {
    console.log("FirmStore::onPortConnectionEvent [msg=%s]", msg);
    let event = fromJS({
      portName:     msg.portName,
      ringName:     msg.ringName,
      groupName:    msg.groupName,
      time:         msg.time,
      eventName:    msg.event,
    });
    return state.setIn(["portEvents", state.get("portEvents").size], event);
  }

  onPortMaint(state, msg) {
    console.log("FirmStore::onPortMaint [msg=%s]", msg);
    let entry = fromJS({
      last:         '00:00:00.000',
      groupName:    msg.groupName,
      name:         msg.name,
      ringName:     msg.ringName,
      blocks:    0,
      rateCurrent:  0,
      rate1Min:     0,
      rate5Min:     0,
      qlCurrent:    0,
      ql1Min:       0,
      limitCurrent: 0,
      limit1Min:    0,
      limit5Min:    0,
      numQuotes:       0,
      numBlocks:       0,
      numPurges:       0,
      numUndPurges:    0,
      changed:      false});

    if (!state.get("groupMap").has(msg.groupName)) {
      state = state.setIn(["groupMap", msg.groupName], entry);
    }

    return state.setIn(["groupPortMap", msg.groupName, msg.name], entry);
  }

  onPortActivity(state, msg) {
    console.log("FirmStore::onPortActivity [msg=%s]", msg);

    // reset changed flag
    state = state.set("groupMap", state.get("groupMap").map( f => f.set("changed", false)));

    let currentGroupMap  = state.get("groupMap");

    //------------------------------
    // update group-level totals
    let now = currentGroupMap.get(msg.groupName);
    let next = now.mergeWith(
      (oldVal, newVal, key) => {
        switch(key) {
          case "numBlocks":
          case "numQuotes":
          case "numPurges":
          case "numUndPurges":
            return oldVal + newVal;
          default:
            return newVal;
        }
      }, fromJS(msg)
    );

    next = next.set("changed", true);
    state =  state.setIn(
          ["groupMap", msg.groupName], next
    );


    //------------------------------
    // update port-level totals
    // reset changed in port entry
    state = state
      .updateIn(["groupPortMap", msg.groupName, msg.name, "changed"], changed => false);

    let nextPort = state.getIn(["groupPortMap", msg.groupName, msg.name]);

    nextPort = nextPort.mergeWith(
      (oldVal, newVal, key) => {
        switch(key) {
          case "numBlocks":
          case "numQuotes":
          case "numPurges":
          case "numUndPurges":
            return oldVal + newVal;
          default:
            return newVal;
        }
      }, Map(msg)
    );

    state = state.setIn(
      ["groupPortMap", msg.groupName, msg.name], 
      nextPort
    );

    let showingPortMap = state.get("selectedGroup");

    if (showingPortMap) {
      // user has a firm selected
      let selectedGroup = state.get("selectedGroup");

      // update ports if user is viewing same group just updated
      if (selectedGroup == msg.groupName) {
	// update his ports w/ global cache
	state = state.set("portsForSelectedGroup", state.getIn(["groupPortMap", selectedGroup]));
      }
    }

    //------------------------------
    // Update time-series
    now = state.get("latencyStream");
    let data = {time:msg.last, val:msg.ql1Min};

    if (now.size > 40) {
      next = now.push(data).shift();
    } else {
      next = now.push(data);
    }

    state = state.set("latencyStream", next);


    //------------------------------
    // update global summary totals
    now = state.get("groupSummaryInfo");
    next = 
      now
        .set("last", msg.last)
        .set("totQuotes", parseInt(now.get("totQuotes")) + msg.numQuotes)
        .set("totBlocks", parseInt(now.get("totBlocks")) + msg.numBlocks)
        .set("totPurges", parseInt(now.get("totPurges")) + msg.numPurges)
        .set("totUndPurges", parseInt(now.get("totUndPurges")) + msg.numUndPurges);

    return state.set("groupSummaryInfo", next);

    
  }

  _onSortChange(collection, colKey, colDir) {
    console.log("FirmStore:_onSortChange [colKey=%s, colDir=%s]", colKey, colDir);

    let sorted = collection.sortBy(
      (v, k) => {
        console.log(v.get(colKey));
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
        if (result !== 0 && colDir === SortDir.DESC) {
          result *= -1;
        }
        return result;
      }
    );
    console.log(sorted);
    return sorted;
  }

}

export default new FirmStore();
