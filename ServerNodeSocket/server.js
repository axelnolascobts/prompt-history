const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require('http');

const APP = express();
const SERVER = createServer(APP);
const IO = new Server(SERVER);
const PORT = 3000;

APP.use(express.static('/home/user/Documentos/prompt-history/ServerNodeSocket/'));
let userNames = [];
let privateRooms = [];
let privateNames = [];

IO.on('connection', (socket) => {

    //console.log('client connected');

    socket.on('set username', (userName) => {

        let userNameExist = userNames.filter((userNameInList) => userNameInList === userName.toLowerCase());

        if(userNameExist.length === 0){

            socket.userName = userName;
            userNames.push(userName.toLowerCase());
            //console.log(userNames);
            
            console.log(`User: ${socket.userName} with id: ${socket.id} connected to server`);

            IO.emit('chat message', `User: ${socket.userName} connected to server`);

        } else {

            socket.emit('userName error', "These username is occupied");
            socket.disconnect();

        }
 
    });

    socket.on('set private name', (username) => {

        socket.userName = username;

        console.log(`User: ${socket.userName} with id: ${socket.id} connected to private room`);

    });

    socket.on('chat message', (message) => {

        console.log(`Message "${message}" recived from user: ${socket.userName}, with id: ${socket.id}`);

        IO.emit('chat message', `[${socket.userName}]: ${message}`);

    });

    socket.on('private room', (user, receptor) => {

        const ORDER_NAMES = [user, receptor].sort();
        
        const ROOM_NAME = ORDER_NAMES.join("-");
        socket.join(ROOM_NAME);

        let privateRoomIndex = privateRooms.indexOf(ROOM_NAME);

        if (privateRoomIndex === -1) {

            privateRooms.push(ROOM_NAME);
            //console.log(privateRooms);

        }

    });

    socket.on('private message', (user, receptor, message) => {

        const ORDER_NAMES = [user, receptor].sort();
        
        const ROOM_NAME = ORDER_NAMES.join("-");

        IO.to(ROOM_NAME).emit('private message', `[${socket.userName}]: ${message}`);

    });


    socket.on('disconnect', () => {

        if(socket.userName !== undefined) {

            let userNameIndex = userNames.indexOf(socket.userName);

            if(userNameIndex !== -1) {

                userNames.splice(userNameIndex, 1);

            }

            console.log(`User: ${socket.userName} with id: ${socket.id} was discconected`);

            IO.emit('chat message', `User: ${socket.userName} was discconected`);

            for ( let room of privateRooms ) {

                if (room.includes(socket.userName)) {

                    IO.to(room).emit('private message', `User: ${socket.userName} was disconected`);
                    socket.leave(room);

                }
            }

        }
        
    });
    
});

SERVER.listen(PORT, () => {

    console.log(`Server listening in port ${PORT}`);

});