'use strict';
/* global io swal */
/* eslint-disable prefer-arrow-callback */

var socket = io.connect('http://localhost:3000');
var idleTimeout;

function confirmConnect() {
  if (idleTimeout) clearTimeout(idleTimeout);
  swal({
    title: 'Ready to go!',
    text: 'Your Sphero is now connected.',
    type: 'success',
    confirmButtonText: 'Let\'s explore!',
    confirmButtonColor: '#36B4C2',
    customClass: 'setup-modal'
  }, () => {
    $(location).attr('pathname', '/move');
  });
}

socket.on('connected-sphero', confirmConnect);
socket.on('connected-bb8', confirmConnect);

$('#connect-btn-sprk').on('click', () => {
  console.log('connecting to sprk');
  socket.emit('connect-btn-sprk');
  swal({
    title: 'Connecting to Sphero...',
    imageUrl: 'static/img/ripple.gif',
    showCancelButton: true,
    showConfirmButton: false,
    customClass: 'setup-modal'
  }, function(isConfirm) {
    if (!isConfirm) clearTimeout(idleTimeout);
  });
  idleError($('#connect-btn-sprk'));
});

$('#connect-btn-bb8').on('click', () => {
  console.log('connecting to bb8');
  socket.emit('connect-btn-bb8');
  setTimeout(() => {
    socket.emit('connect-btn-bb8');
  }, 2000);
  swal({
    title: 'Connecting to BB-8/Ollie...',
    imageUrl: 'static/img/ripple.gif',
    showCancelButton: true,
    showConfirmButton: false,
    customClass: 'setup-modal'
  }, function(isConfirm) {
    if (!isConfirm) clearTimeout(idleTimeout);
  });
  idleError($('#connect-btn-bb8'));
});

function idleError($btn) {
  idleTimeout = setTimeout(() => {
    swal({
      title: 'Connection failed',
      text: 'There is a problem connnecting to your Sphero. '
        + 'Make sure your Bluetooth is on and your Sphero is awake.'
        + 'Try restarting the server if you keep getting this error.',
      type: 'error',
      confirmButtonText: 'Try again!',
      confirmButtonColor: '#36B4C2',
      showCancelButton: true,
      customClass: 'setup-modal',
      closeOnConfirm: false
    }, () => {
      $btn.trigger('click');
    });
  }, 10000);
}
