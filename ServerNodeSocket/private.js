const MESSAGE_INPUT = document.getElementById("message-input");
const SEND_BUTTON = document.getElementById("send-button");
const CHAT_MESSAGES = document.getElementById("chat-messages");
const SHOW_USERNAME = document.getElementById("show-user-id");
const URLPARAMS = new URLSearchParams(window.location.search);
const USER = URLPARAMS.get("from");
const RECEPTOR = URLPARAMS.get("user");

let socket = io();


socket.on('connect', () => {

    //console.log('conected to server');

    SHOW_USERNAME.textContent = USER;
    socket.emit('set private name', USER);
    socket.emit('private room', USER, RECEPTOR);

});

socket.on('private message', (message) => {

    const MESSAGE = document.createElement("li");
    MESSAGE.className = "message-bubble";
    //MESSAGE.textContent = message;
    CHAT_MESSAGES.appendChild(MESSAGE);

    const MESSAGE_CONTENT = document.createElement("a");
    MESSAGE_CONTENT.textContent = message;
    MESSAGE_CONTENT.className = "message-content";
    MESSAGE.appendChild(MESSAGE_CONTENT);

    const DELETE_BUTTON = document.createElement("p");
    DELETE_BUTTON.className = "delete-button";
    DELETE_BUTTON.textContent = "DELETE MESSAGE";
    MESSAGE.appendChild(DELETE_BUTTON);

    setEventDelete();

});

SEND_BUTTON.onclick = () => {

    if(MESSAGE_INPUT.value.trim() !== ""){

        socket.emit('private message', USER, RECEPTOR, MESSAGE_INPUT.value);
        MESSAGE_INPUT.value = "";
    }
}

function setEventDelete() {

    const MESSAGES_TEXT = Array.from(document.getElementsByClassName("message-content"));
    const DELETE_GROUP = Array.from(document.getElementsByClassName("delete-button"));

    DELETE_GROUP.forEach((button, i) => {

        // console.log(MESSAGES_TEXT.length);
        // console.log(DELETE_GROUP.length);
            
        button.onclick = () => {
            DELETE_GROUP[i].textContent = "";
            MESSAGES_TEXT[i].textContent = "THIS MESSAGE WAS DELETED FOR YOU";
                
        };
    });
}
