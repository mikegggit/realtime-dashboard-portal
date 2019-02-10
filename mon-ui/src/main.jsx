"use strict"

import AppContainer from './AppContainer';
//import OpeningApp from './OpeningApp';
import ReactDOM from 'react-dom';
import React from 'react'; 
//import { BrowserRouter, Route, Link } from 'react-router-dom';
// Render your table 
console.log("Rendering application.");

{/*
ReactDOM.render((
  <BrowserRouter>
    <div>
    <Link to="/opening">opening</Link>
      <Route exact path="/" component={AppContainer} />
      <Route path="/opening" component={OpeningApp} />
    </div>
  </BrowserRouter>),
  document.getElementById('app'));
*/}
ReactDOM.render(
  <AppContainer/>,
  document.getElementById('app'));

