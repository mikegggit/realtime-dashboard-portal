import React from 'react';
import { NavDrawer } from 'react-toolbox/lib/layout';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import { FontIcon }  from 'react-toolbox/lib/font_icon';
import styles  from './MonSidebar.css';

class MonSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  onOverlayClick() {
    console.log("MonSidebar::onOverlayClick");
    this.props.actions.toggleSideMenu();
  }
 
  render() {
    return (
      <NavDrawer active={this.props.active} onOverlayClick={this.onOverlayClick}>
        <div className={styles.header}/> 
        <MenuItem value='openingmon' icon='dashboard' caption='Opening Monitor' />
        <MenuDivider />
        <MenuItem value='rowing' icon='rowing' caption='Port Monitor' disabled />
        <MenuItem value='rowing' icon='rowing' caption='Pricing Monitor' disabled />
        <MenuDivider />
        <MenuItem value='settings' icon='settings' caption='Settings' disabled />
      </NavDrawer>
    );
  }
}

export default MonSidebar;

