const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {};
const usernameToSocketIds = {};
const messages = { Everyone: [] };
const usersNames = [];

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Nuevo usuario
  socket.on("new user", (username) => {
    const normalized = username.trim().toLowerCase();
    let nameInUse = false;
    for (let key in users) {
      if (users[key].trim().toLowerCase() === normalized) {
        nameInUse = true;
        break;
      }
    }
    if (nameInUse) {
      socket.emit("username exists");
      return;
    }
    users[socket.id] = username;

    // Manejo de múltiples conexiones por usuario
    if (!usernameToSocketIds[username]) {
      usernameToSocketIds[username] = new Set();
      usersNames.push(username);
      io.emit("user connected", username);
      io.emit("chats", usersNames);
      console.log(`Usuario registrado: ${username}`);
      console.log(`Usuarios actuales: ${usersNames.join(", ")}`);
    }
    usernameToSocketIds[username].add(socket.id);
  });

  // Mensaje público
  socket.on("chat message", (data) => {
    messages["Everyone"].push(data);
    io.emit("chat message", data);
    console.log(`[General] ${data.name}: ${data.message}`);
  });

  // Mensaje privado
  socket.on("private message", ({ to, message, id }) => {
    const from = users[socket.id];
    if (!messages[from]) messages[from] = [];
    if (!messages[to]) messages[to] = [];
    const messageData = { from, to, message, id };

    // Guarda en ambos historiales
    messages[from].push({ ...messageData, self: true });
    messages[to].push(messageData);

    // Envía al emisor con self: true y al receptor normal
    for (let socketId in users) {
      const userName = users[socketId];
      if (userName === from) {
        io.to(socketId).emit("private message", { ...messageData, self: true });
      } else if (userName === to) {
        io.to(socketId).emit("private message", messageData);
      }
    }
    console.log(`[Privado] ${from} -> ${to}: ${message}`);
  });

  // Eliminar mensaje (general y privado)
  socket.on("delete message", ({ id, chat }) => {
    // Buscar el arreglo de mensajes del chat
    const chatMessages = messages[chat];
    if (!chatMessages) return;
    // Buscar el mensaje por id
    const message = chatMessages.find((msg) => msg.id === id);
    if (!message) return;

    // Si es mensaje general y es tuyo, lo puedes eliminar
    if (chat === "Everyone" && message.name === users[socket.id]) {
      message.deleted = true;
      io.emit("message deleted", { id, chat: "Everyone" });
      console.log(`Message deleted in general: ${message.id}`);
    }
    // Si es privado y tú lo enviaste, lo puedes eliminar
    else if (message.from === users[socket.id] && chat !== "Everyone") {
      // Marcar como eliminado en ambos historiales (emisor y receptor)
      const involvedUsers = [message.from, message.to];
      for (let i = 0; i < involvedUsers.length; i++) {
        const userMessages = messages[involvedUsers[i]];
        if (!userMessages) continue;
        const index = userMessages.findIndex((msg) => msg.id === id);
        if (index !== -1) userMessages[index].deleted = true;
      }
      // Avisar a ambos usuarios
      for (let socketId in users) {
        const userName = users[socketId];
        if (userName === chat || userName === users[socket.id]) {
          io.to(socketId).emit("message deleted", { id, chat });
        }
      }
      console.log(`Private message deleted: ${message.id} in chat ${chat}`);
    }
  });

  // Desconexión de usuario
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];

      const sockets = usernameToSocketIds[username];
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        delete usernameToSocketIds[username];
        const index = usersNames.indexOf(username);
        if (index !== -1) usersNames.splice(index, 1);
        socket.broadcast.emit("user disconnected", username);
        io.emit("chats", usersNames);
        console.log(`Usuario desconectado: ${username}`);
      }
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
