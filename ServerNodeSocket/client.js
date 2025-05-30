const MESSAGE_INPUT = document.getElementById("message-input");
const SEND_BUTTON = document.getElementById("send-button");
const CHAT_MESSAGES = document.getElementById("chat-messages");

const SOCKET = io();
let userName = "";

while(userName.length >= 30 || userName.length < 1 || userName === null) {

    userName = prompt("INSERT USER NAME (no more 30 charcaters)");
        
}

SOCKET.on('connect', () => {

    console.log('conected to server');

    SOCKET.emit("chat message", `User ${userName} connected to server`);

});

SOCKET.on('chat message', (message) => {

    const MESSAGE = document.createElement("li");
    MESSAGE.textContent = message;
    CHAT_MESSAGES.appendChild(MESSAGE);

});

SEND_BUTTON.onclick = () => {

    if(MESSAGE_INPUT.value !== ""){

        SOCKET.emit("chat message", `[ ${userName} ]: ${MESSAGE_INPUT.value}`);
        MESSAGE_INPUT.value = "";
    }
}