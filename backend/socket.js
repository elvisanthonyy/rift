import { Server } from 'socket.io'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { User } from './models/userModel.js'


export const io = new Server()
    
    const userSockets = {}

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if(!token) {
            return next(new Error('Authentication error'))
            console.log('no token')
        }
        
        passport.authenticate('jwt', { session: false }, async () => {
           
            try{
                
                const decoded = jwt.verify(token, 'secret1234')
                const email = decoded.email
                const user = await User.findOne({email: email})

            if(!user) {
                console.log('no user')
                return next(new Error('Authentication error'))
            } else {
                socket.user = user
                userSockets[user._id] = socket.id
                next()
            }
    
            } catch(error) {
                console.log(error)
                return next(new Error('Authentication error'))
                
            }

        })({ headers: { authorization: `Bearer ${token}` }});
    })
    
    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.username)

        socket.on('disconnect', () => {
            delete userSockets[socket.user._id]
            console.log('User disconnected:', socket.user.username)
        })
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    })






export function sendNotification(userId, message) {
    const socketId = userSockets[userId];
    if (socketId) {
        console.log('sending notification to:', socketId)

        io.to(socketId).emit('notification', message)
      
    }
}

