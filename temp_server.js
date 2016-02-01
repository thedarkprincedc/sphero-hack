'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const setupBB8 = require(__dirname + '/setup/setup-bb8');
const setupSphero = require(__dirname + '/setup/setup-sphero');
const connectFn = require(__dirname + '/lib/device-config');
const lights = require(__dirname + '/commands/lights');
const sphero = require('sphero');
var config = require('home-config').load('.bb8config');
var orb;

server.listen(3000, () => console.log('Server running on port 3000'));

app.set('views', __dirname + '/views');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index.jade');
});

io.on('connection', socket => {
  socket.on('setup-sphero', () => {
    setupSphero();
    orb = connectFn.spheroConnect();
  });

  socket.on('connect-sphero', () => {
    orb.connect(() => {
      console.log('connected!');
      orb.roll(100, 0, () => {
        console.log('performed roll');
      });
    });
  });

  socket.on('setup-bb8', () => {
    setupBB8(() => {
      console.log('setup callback');
      orb = connectFn.bb8Connect();
    });
  });

  socket.on('connect-bb8', () => {
    console.log('received event');
    orb.connect(() => {
      console.log('connected!');
      orb.roll(100, 0, () => {
        console.log('performed roll');
      });
    });
  });

  socket.on('flashingLights', () => {
    lights(orb);
  });

  socket.on('robot-action', () => {
    // Send generic command to sphero
    // orb[opts.type].apply(orb, [...opts.args,
    //   () => event.sender.send('performed action: ' + opts.type)]);
  });
});