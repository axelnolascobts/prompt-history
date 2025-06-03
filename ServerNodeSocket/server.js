const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require('http');

const APP = express();
const SERVER = createServer(APP);
const IO = new Server(SERVER);
const PORT = 3000;

APP.use(express.static('/home/user/Documentos/prompt-history/ServerNodeSocket/'));
let userNames = [];

IO.on('connection', (socket) => {

    //console.log('client connected');

    socket.on('set username', (userName) => {

        let userNameExist = userNames.filter((userNameInList) => userNameInList === userName);
        

        if(userNameExist.length === 0){

            socket.userName = userName;
            userNames.push(userName);

            console.log(`User: ${socket.userName} with id: ${socket.id} connected to server`);

            IO.emit('chat message', `User: ${socket.userName} connected to server`);

        } else {

            socket.emit('userName error', "These username is occupied");
            socket.disconnect();

        }
 
    });

    socket.on('chat message', (message) => {

        console.log(`Message "${message}" recived from user: ${socket.userName}, with id: ${socket.id}`);

        IO.emit('chat message', `[${socket.userName}]: ${message}`);

    });


    socket.on('disconnect', () => {

        if(socket.userName !== undefined) {

            console.log(`User: ${socket.userName} with id: ${socket.id} was discconected`);

            IO.emit('chat message', `User: ${socket.userName} was discconected`);

            let userNameIndex = userNames.indexOf(socket.userName);

            if(userNameIndex !== -1) {

                userNames.splice(userNameIndex, 1);

            }

        }
        
    });
    
});

SERVER.listen(PORT, () => {

    console.log(`Server listening in port ${PORT}`);

});