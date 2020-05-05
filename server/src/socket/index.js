const socketIO = require('socket.io');

module.exports = server => {
  // Socket.io setup
  const io = socketIO.listen(server);

  // Events
  io.on('connection', function(socket) {
    console.log('Socket ID', socket.id);

    if (socket.handshake.query && socket.handshake.query.token) {
      console.log(socket.handshake.query.token);
    }

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  });
};
