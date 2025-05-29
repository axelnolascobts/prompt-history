const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server);
const port = 3000;

io.on('connection', (socket) => {

    console.log('client connected');

    socket.on('chat message', (message) => {

        console.log(`Mensaje recibido: ${message}`);
        io.emit('chat message', message);

    });

    socket.on('disconnect', () => {

        console.log('Client disconnected');
        
    });
    
});

server.listen(port, () => {

    console.log(`Servidor escuchando en el puerto ${port}`);
    
});


