const express = require("express");
const socket = require("socket.io");
const auth = require("./middleware/authorization");

const PORT = 3000;
const app = express();
const options = {
    cors: true,
    origin: ['http://localhost:5173']
}

app.use(require('./controllers/users'));

const server = app.listen(PORT, () => {
    console.log('server is started')
})

const io = socket(server, options);


app.get('/', (req, res) => {
    res.send('ok')
})

app.get('/auth', auth, (req, res) => {
    res.send('ok')
})

app.get('/token', (req, res) => {

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