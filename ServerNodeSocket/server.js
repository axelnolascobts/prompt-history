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
let mainChatUserIds = [];

IO.on('connection', (socket) => {

    //console.log('client connected');

    socket.on('set username', (userName) => {

        let userNameExist = userNames.filter((userNameInList) => userNameInList === userName.toLowerCase());

        if(userNameExist.length === 0){

            socket.userName = userName;
            userNames.push(userName.toLowerCase());
            mainChatUserIds.push(socket.id);
            //console.log(userNames);
            
            console.log(`User: ${socket.userName} with id: ${socket.id} connected to server`);

            IO.emit('server message', `User ${socket.userName} connected to server`);

        } else {

            socket.emit('userName error', "These username is occupied");
            socket.disconnect();

        }
 
    });

    socket.on('set private name', (username) => {

        socket.userName = username;

    });

    socket.on('chat message', (message) => {

        console.log(`Message "${message}" recived from user: ${socket.userName}, with id: ${socket.id}`);

        IO.emit('chat message', `[${socket.userName}]: ${message}`);

    });

    socket.on('private room', (user, receptor) => {

        let keyPass = true;
        const ORDER_NAMES = [user, receptor].sort();
        
        const ROOM_NAME = ORDER_NAMES.join("-");
        socket.join(ROOM_NAME);

        for ( let room of privateRooms ) {

            if (room.userName === socket.userName && room.roomName === ROOM_NAME){

                socket.emit('private room error', "You are in chat now!");
                socket.disconnect();
                keyPass = false;
                
            }
        }

        if(keyPass) {

            console.log(`User: ${socket.userName} with id: ${socket.id} connected to private room`);
            IO.to(ROOM_NAME).emit('private server message', `User: ${socket.userName} join to private chat`);

            let roomData = {
                userName: socket.userName,
                userId: socket.id,
                roomName: ROOM_NAME
            };

            privateRooms.push(roomData);
            console.log(privateRooms);

        }

        // let privateRoomIndex = privateRooms.indexOf(ROOM_NAME);

        // if (privateRoomIndex === -1) {

        //     privateRooms.push(ROOM_NAME);
        //     //console.log(privateRooms);

        // }

    });

    socket.on('private message', (user, receptor, message) => {

        const ORDER_NAMES = [user, receptor].sort();
        
        const ROOM_NAME = ORDER_NAMES.join("-");

        IO.to(ROOM_NAME).emit('private message', `[${socket.userName}]: ${message}`);
        console.log(`Private message "${message}" recived from user: ${socket.userName}, with id: ${socket.id}`);


    });


    socket.on('disconnect', () => {

        if(socket.userName !== undefined) {

            let userIdIndex = mainChatUserIds.indexOf(socket.id);

            if (userIdIndex !== -1) {

                userNames.splice(userIdIndex, 1);
                mainChatUserIds.splice(userIdIndex, 1);

                console.log(userNames);

                console.log(`User: ${socket.userName} with id: ${socket.id} was discconected`);

                IO.emit('server message', `User ${socket.userName} was discconected`);

            } else {

                let index = 0;

                for ( let room of privateRooms ) {

                    if (room.userId === socket.id) {

                        IO.to(room.roomName).emit('private server message', `User ${socket.userName} left private chat`);
                        console.log(`User: ${socket.userName} with id: ${socket.id} was left room: ${room.roomName}`);
                        socket.leave(room);

                        privateRooms.splice(index, 1);

                    }

                    index++;
                }
            }

        }
        
    });
    
});

SERVER.listen(PORT, () => {

    console.log(`Server listening in port ${PORT}`);

});