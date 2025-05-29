const { Server } = require("socket.io");

// Crear instancia del servidor en el puerto 3000 (usa HTTP interno por defecto)
const io = new Server(3000);

io.on("connection", (socket) => {
  console.log(" Cliente conectado:", socket.id);

  socket.on("mensaje", (msg) => {
    console.log("Mensaje recibido:", msg);
    socket.emit("respuesta", "Servidor dice: recibido tu mensaje");
  });

  socket.on("disconnect", () => {
    console.log(" Cliente desconectado:", socket.id);
  });
});

console.log(" Servidor Socket.IO escuchando en el puerto 3000");
