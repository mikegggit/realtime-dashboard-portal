'use strict';

var SockJS = require('sockjs-client'); 
require('stompjs'); 

function register(registrations) {
  var socket = SockJS('http://localhost:8080/sqf');  
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function(frame) {
    console.log("register");
    registrations.forEach(function (registration) { 
      console.log("subscribing");
      stompClient.subscribe(registration.route, registration.callback);
    });
  }, function(error) {
    console.log("error!!!");
    console.log(error);
  });
}

module.exports.register = register;


