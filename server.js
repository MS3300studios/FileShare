const express = require("express");
const socket = require("socket.io");
const auth = require("./middleware/authorization");
const cors = require("cors");
require('dotenv').config()

const PORT = 3000;
const app = express();
const socketCorsOptions = {
    cors: true,
    origin: ['http://localhost:5173']
}
const serverCorsOptions = {
    origin: "http://localhost:5173"
}

app.use(require('./controllers/users'));
app.use(require('./controllers/contacts'));
app.use(require('./controllers/files'));
app.use(require('./controllers/conversation'));
app.use(cors(serverCorsOptions));

const server = app.listen(PORT, () => {
    console.log('server is started')
})

const io = socket(server, socketCorsOptions);

app.get('/', (req, res) => {
    res.send('ok')
})

app.get('/auth', auth, (req, res) => {
    res.send('ok')
})

io.on("connection", socket => {
    socket.emit('welcome', socket.id)
    socket.join('room1');
    socket.on('message', message => {
        io.to("room1").emit('receiveMessage', {
            userId: socket.id,
            message: message
        })
    })
})