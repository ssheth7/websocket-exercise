const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {

  socket.on('join_room', (name, room) => {
    socket.join(room);
    socket.to(room).emit('join_room', name);
    console.log(socket.rooms);
  });

  socket.on('message', ({ name, message, room }) => {
    // console.log(`${name} sends <${message}> in ${room}`);
    io.to(room).emit('message', { name, message });
  });

  socket.on('disconnect', () => {
    // console.log('Disconnect Fired');
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
