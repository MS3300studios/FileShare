const express = require("express");
const socket = require("socket.io");
const auth = require("./middleware/authorization");
const cors = require("cors");
const { messageSchema, Conversation } = require("./models/Chat");
const path = require("path");
require('dotenv').config()

const PORT = 2305;
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
// const socketCorsOptions = {
//     cors: true,
//     origin: ['*'],
//     path: '/api/'
    // origin: ['http://localhost:5173']
// }

// const io = socket(server, socketCorsOptions);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
    path: '/20_strusinski/aplikacja/api',
});

// const serverCorsOptions = {
//     origin: "http://localhost:5173"
// }

app.use(require('./controllers/users'));
app.use(require('./controllers/contacts'));
app.use(require('./controllers/files'));
app.use(require('./controllers/conversation'));
app.use(cors());

app.use(express.static(path.join(__dirname, 'assets')));

server.listen(PORT, () => {
    console.log('server is started')
})

app.use('*', (req, res, next) => {
    console.log('[DEBUG] ', req.originalUrl)
    if (req.originalUrl.startsWith('/api/')) {
        next();
    } else {
        res.sendFile(path.join(__dirname, 'index.html'))
    }
});

// app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'index.html'))
// })

// app.get('/#/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// })

app.get('/test', (req, res) => {
    res.send('ok test')
})

io.on("connection", socket => {
    socket.on('message', message => {  //message: { conversationId: currentConversation._id, text: newMessage, authorNickname: userData.nickname }
        //save message based on schema
        Conversation.findById(message.conversationId).exec().then(conv => {
            const newMessage = { authorNickname: message.authorNickname, text: message.text }
            conv.messages = [...conv.messages, newMessage]
            conv.save().then(resp => {
                io.to(message.conversationId).emit('receiveMessage', {
                    userId: socket.id,
                    message: {...message, createdAt: Date.now() },
                })
            })
        })

    })

    socket.on('join', ({conversationId}) => {
        console.log(`a user joined room nr: ${conversationId}`)
        socket.join(conversationId); //user is joining a specific rom
    })
})