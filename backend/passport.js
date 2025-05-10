import express from 'express'
import { Server } from 'socket.io'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { User } from './models/userModel.js'


const io = new Server()
const app = express()
app.use(passport.initialize())


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret1234',
}


passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {

        try {
           const user = await User.findById(jwtPayload.id) 
           if(user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
        } catch (error) {
            console.log(error)
            return done(err, false)
        }

}))



export default passport;
