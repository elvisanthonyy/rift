import express from "express"
import cors from 'cors'
import mongoose from "mongoose"
import { PORT, mongoDBURL } from "./config.js"
import userRoutes  from './routes/userRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import friendRoutes from './routes/frendRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { Profile } from "./models/profileModel.js"
import { io, sendNotification} from './socket.js'
import { Server } from 'socket.io'
import { createServer} from 'http';



const app = express()

app.use(cors());

const server = createServer(app)

const corsOptions  = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: 'something'
    }
}

io.attach(server, corsOptions)

app.use(express.json())
/*const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: 'something'
    }
})*/

app.use('/user', userRoutes)
app.use('/profile', profileRoutes)
app.use('/friend', friendRoutes)
app.use('/message', messageRoutes)
app.use('/conversation', conversationRoutes)
app.use('/post', postRoutes)


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app is connected to database");
        server.listen(PORT, () => {
            console.log('listening')
        })
    })
    .catch((error) => {
        console.log(error)
    })

/*io.on('connection', (socket) => {
    console.log('a user')

    socket.on('disconnect', () => {
        console.log(socket.id)
    })

    socket.on('chat message', (msg) => {
        console.log('message' + msg)
        io.emit('chat message', + msg)
    })
})*/