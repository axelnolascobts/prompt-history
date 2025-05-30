const http = require('http');
const socket = require('socket.io');

const server = http.createServer();

const io = socket(server);

const usuarios = new Map(); 

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('nuevo usuario', (nombre) => {
    usuarios.set(socket.id, nombre);
    io.emit('usuario conectado', nombre);
    console.log(`${nombre} se conecto`);
  });


  socket.on('chat message', (data) => {
    io.emit('chat message', data);
    console.log(`[${data.nombre}] ${data.mensaje}`);
  });

 
  socket.on('disconnect', () => {
    const nombre = usuarios.get(socket.id);
    if (nombre) {
      io.emit('usuario desconectado', nombre);
      console.log(`${nombre} se desconecto`);
      usuarios.delete(socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
