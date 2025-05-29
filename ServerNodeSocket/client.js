//const { io } = require('socket.io-client');

// const MESSAGE_INPUT = document.getElementById("message-input");
// const SEND_BUTTON = document.getElementById("send-button");
// const CHAT_MESSAGES = document.getElementById("chat-messages");

const SOCKET = io();

SOCKET.on('connect', () => {

    console.log('conected to server');

});

SOCKET.on('chat message', (message) => {

    console.log(`\nNew Message: ${message}`);

});