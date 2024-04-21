let sio = require('socket.io');
let io: any = null;

exports.io = function () {
  return io;
};

exports.initialize = function(server: any, options: any) {
  return io = sio(server, options);
};
