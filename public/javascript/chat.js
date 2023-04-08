const socket = io();

const chat = document.querySelector('.chat-form')
const chatInput = document.querySelector('.chat-input')
chat.addEventListener('submit', e => {
    e.preventDefault()
    // we are going to send the value via socket here
    socket.emit('chat', chatInput.value)
    chatInput.value = ''
})

const chatDump = document.querySelector('.chat-messages')
const render = ({ message, id, time }) => {
    const outerDiv = document.createElement('div');
    const timeDiv = document.createElement('span');
    const div = document.createElement('div');
    outerDiv.classList.add('chat-message-container');
    timeDiv.classList.add('time');
    div.classList.add('chat-message');
    if (id === socket.id) { // broadcasted chat is from this client
        div.classList.add('chat-message--user');
        outerDiv.classList.add('chat-message-container--user');
        timeDiv.classList.add('time--user')
    }
    div.innerText = message // insert message into new div
    timeDiv.innerText = time;
    outerDiv.append(div, timeDiv)
    chatDump.appendChild(outerDiv)
}

socket.on('chat', data => {
    render(data)
    // console.log(data)
})