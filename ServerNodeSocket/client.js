const MESSAGE_INPUT = document.getElementById("message-input");
const SEND_BUTTON = document.getElementById("send-button");
const CHAT_MESSAGES = document.getElementById("chat-messages");
const SHOW_USERNAME = document.getElementById("show-user-id");


let userName = "";
let socket = null;


function askUserName() {

    while(userName === null || userName.length >= 30 || userName.trim().length < 1) {

        userName = prompt("INSERT USER NAME (no more 30 charcaters)");
        
    }

    socket = io();

    socket.on('connect', () => {

        //console.log('conected to server');

        socket.emit('set username', userName);
        SHOW_USERNAME.textContent = userName;

    });

    socket.on('userName error', (message) => {

        alert(message);
        userName = "";
        askUserName();

    });

    socket.on('chat message', (message) => {

        const MESSAGE = document.createElement("li");
        //MESSAGE.textContent = message;
        CHAT_MESSAGES.appendChild(MESSAGE);
        const MESSAGE_CONTENT = document.createElement("a");
        MESSAGE_CONTENT.textContent = message;
        MESSAGE.appendChild(MESSAGE_CONTENT);
        const DELETE_BUTTON = document.createElement("p");
        DELETE_BUTTON.className("delete-button");
        DELETE_BUTTON.textContent = "DELETE MESSAGE";
        MESSAGE.appendChild(DELETE_BUTTON);

    });

    SEND_BUTTON.onclick = () => {

        if(MESSAGE_INPUT.value.trim() !== ""){

            socket.emit("chat message", MESSAGE_INPUT.value);
            MESSAGE_INPUT.value = "";
        }
    }

}

askUserName();