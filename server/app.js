const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

const users = []
let user = null

io.on('connection', (socket) => {

  socket.on('join_room', (name, room) => {
    users.push({name: name, room: room, id: socket.id})
    socket.join(room);
    socket.to(room).emit('join_room', name);
    console.log(socket.rooms);
  });

  socket.on('message', ({ name, message, room }) => {
    // console.log(`${name} sends <${message}> in ${room}`);
    io.to(room).emit('message', { name, message });
  });

  socket.on('disconnect', () => {
    const getId = user => user.id === socket.id
    const index = users.findIndex(getId)
    if(index !== -1) user = users.splice(index, 1)[0]
    if (user)
    io.to(user.room).emit('message', { name: 'ChatBot', message: `${user.name} has left the chat` })
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
