'use strict';

module.exports = exports = (port, openBrowser) => {
  const express = require('express');
  const app = express();
  const Router = require(__dirname + '/../routes/router');
  const socketListeners = require(__dirname + '/socket-listeners');
  const opn = require('opn');

  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../views');

  app.use('/', Router);
  app.use('/static', express.static(__dirname + '/../public'));

  const server = require('http').Server(app);
  const io = require('socket.io')(server);

  // Creates all socket.io event listeners
  var orb;
  socketListeners(io, orb);

  var serverInst = server.listen(port, () => {
    console.log('server running on port ' + port);
  });

  if (openBrowser) opn('http://localhost:' + port);

  return serverInst;
};
