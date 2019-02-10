"use strict"

import React from 'react';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { FontIcon }  from 'react-toolbox/lib/font_icon'

class MonAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDrawerActive = this.toggleDrawerActive.bind(this); 
  }

  toggleDrawerActive() {
    console.log("MonAppBar::toggleDrawerActive");
    this.props.actions.toggleSideMenu(); 
  }
 
  render() {
    const MenuIcon = () => (
      <FontIcon value='star'/>
    ); 
   
    let stale = this.props.warningNoUpdates;
    return (
      <AppBar title='Opening Monitor' leftIcon="menu" onLeftIconClick={this.toggleDrawerActive }>
   
      {
        (() => {
          if (stale) {
            return <div><FontIcon value='warning' style={{color: 'yellow'}}/><span>Last: {this.props.lastTimestampString}</span></div>
          } else {
            return <div>Last: {this.props.lastTimestampString}</div>
          }
        })()
      }
       { /*<div><img src={require('../public/images/logo-ribbon-beta.png')}/></div>*/ }
      </AppBar>
    );
  }

}

export default MonAppBar;
