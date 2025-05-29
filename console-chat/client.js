const { io } = require('socket.io-client');
const readline = require("readline");

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', () => {

    console.log('conected to server, write a message: ');

});

socket.on('chat message', (message) => {

    console.log(`\nNew Message: ${message}`);

});

rl.on('line', (input) => {
    socket.emit('chat message', input);
});