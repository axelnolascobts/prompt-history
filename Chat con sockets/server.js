const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users_names = [];
const users = {};
const messages = []; 

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Registrar nuevo usuario
  socket.on("new user", (username) => {
    if (users_names.includes(username)) {
      socket.emit("username exists");
      return;
    }
    users[socket.id] = username;
    users_names.push(username);
    io.emit("user connected", username);
    io.emit("chats", users_names);
    console.log(`${username} connected`);
    console.log(`Current users: ${users_names.join(", ")}`);
  });

  // Recibir y emitir mensajes de chat
  socket.on("chat message", (data) => {
    messages.push(data); 
    io.emit("chat message", data);
    console.log(`[${data.name}] ${data.message}`);
  });

  // Eliminar mensaje
  socket.on("delete message", (id) => {
    const msg = messages.find((m) => m.id === id);
    if (msg && users[socket.id] === msg.name) {
      io.emit("message deleted", id);
    }
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("user disconnected", username);
      console.log(`${username} disconnected`);
      delete users[socket.id];
      const index = users_names.indexOf(username);
      if (index !== -1) {
        users_names.splice(index, 1);
      }
      console.log(`Current users after disconnect: ${users_names.join(", ")}`);
      io.emit("chats", users_names); 
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// poder chatear con un solo cliente
// que el mismo username al ingresar no se muestre el mensaje de que ingreso al server
