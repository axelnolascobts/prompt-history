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

    socket.on('server message', (message) => {

        const MESSAGE = document.createElement("li");
        MESSAGE.className = "server-message";
        MESSAGE.textContent = message;
        CHAT_MESSAGES.appendChild(MESSAGE);

    });

    SEND_BUTTON.onclick = () => {

        if(MESSAGE_INPUT.value.trim() !== ""){

            socket.emit("chat message", MESSAGE_INPUT.value);
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

            MESSAGES_TEXT[i].onclick = () => {
            
                const match = MESSAGES_TEXT[i].textContent.match(/^\[([^\]]+)\]:/);
                if (match && match[1] !== userName) {
                    const targetUser = match[1];
                    window.open(`private.html?user=${targetUser}&from=${userName}`, '_blank', 'width=700', 'height=500');
                }
            };
        });
    }

}

askUserName();