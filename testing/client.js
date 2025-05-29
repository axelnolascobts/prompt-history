const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(" Conectado al servidor:", socket.id);
  socket.emit("mensaje","Hola desde el cliente");
});

socket.on("respuesta", (msg) => {
  console.log(" Respuesta del servidor:", msg);
  socket.disconnect();
});

socket.on("disconnect", () => {
  console.log(" Desconectado del servidor");
});
