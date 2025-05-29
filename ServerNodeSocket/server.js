const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require('http');

const APP = express();
const SERVER = createServer(APP);
const IO = new Server(SERVER);
const PORT = 3000;

APP.use(express.static('//home/user/Documentos/prompt-history/ServerNodeSocket/'));

IO.on('connection', (socket) => {

    console.log('client connected');

    socket.on('chat message', (message) => {

        console.log(`Message recived: ${message}`);
        IO.emit('chat message', message);
    });

    socket.on('disconnect', () => {

        console.log('client disconnected');

    });
    
});

SERVER.listen(PORT, () => {

    console.log(`Server listening in port ${PORT}`);

});