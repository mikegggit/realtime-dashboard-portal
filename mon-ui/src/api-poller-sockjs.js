'use strict';

var SockJS = require('sockjs-client'); 

function register(registrations) {
  registrations.forEach(function (registration) {
    console.log("subscribing");
    var url="http://localhost:8080" + registration.route;
  
    var socket = SockJS(url, null, { transports: [ "xhr-polling"] });  

    socket.onopen = function() {
      console.log("socket.onopen");
    };

    socket.onmessage = function(e) {
      console.log('onmessage', e.data);
    };

    socket.onclose = function() {
      console.log("socket.onclose"); 
    };

    socket.onerror = function() {
      console.log("socket.onerror");
    };

  });
}

module.exports.register = register;


