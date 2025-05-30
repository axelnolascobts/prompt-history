const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Registrar nuevo usuario
  socket.on("new user", (username) => {
    users[socket.id] = username;
    io.emit("user connected", username);
    console.log(`${username} connected`);
  });

  // Recibir y emitir mensajes de chat
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
    console.log(`[${data.name}] ${data.message}`);
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    const username = users[socket.id]
    if (username) {
      io.emit("user disconnected", username);
      console.log(`${username} disconnected`);
      delete username[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
