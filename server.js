const app = require('./app.js');
const express = require("express");
const moment = require('moment');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = require('http').createServer(app);
const io = require('socket.io')(server);



io.on('connection', socket => {
  console.log('Some client connected')
  socket.on('chat', message => {
    // console.log('message from client: ', message)
    io.emit('chat', { message, id: socket.id, time: moment().format('h:mm a') })
  })
})



const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`server should be running at http://localhost:${port}/`))