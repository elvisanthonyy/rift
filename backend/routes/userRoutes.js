import express from 'express'
import { User } from '../models/userModel.js'
import { Profile } from '../models/profileModel.js'
import jwt from 'jsonwebtoken'
import { Friend } from '../models/friendsModel.js'
import passport from '../passport.js'

const app = express()

const route = express.Router()

route.use(express.json());

//get profile to display in the nav bar
route.get('/profile',  passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    try {

        const user = req.user

        const profile = await Profile.findOne({userId: user._id})
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'something is wrong' });
    }
})

//get friends to add
route.get('/discover',  passport.authenticate('jwt', { session: false }), async (req, res) => {
   
    try {

        const user = req.user

        if(user) {
            const friends = await Friend.find({userId: user._id})
            const friendsId = friends.map(friend => friend.friendId)

            //exemptions
            const users = await User.find({
                $and: [
                {_id: { $nin: friendsId}}, 
                {_id: {$ne: user._id}}
                ]
            }).select('username')

            return res.status(200).json({
                discoverFriends: users
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'something is wrong' });
    }
})

//for registration
route.post('/register', async (req, res) => {
    try {
        //check if all fields are sent
        if(!req.body.username || !req.body.email || !req.body.password) {
            res.json({ status: "error", error: 'send all fields' });
        } else {
        const checkEmail = await User.findOne({email: req.body.email})
        const checkUser = await User.findOne({username: req.body.username})
        if(checkEmail || checkUser) {
            res.json({ status: "error", error: 'user already exist' });
        } else {
            
            const user = new User ({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
    
            
            const savedUser = await user.save()
            
            //creating profile for user
            const profile = new Profile ({
                userId: savedUser._id,
                firstName: savedUser.username
            })
    
            await profile.save().catch((error) => {console.log(error)})
            res.json({ status: "ok"});
        }
        }
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'something is wrong' });
    }
})

//login route
route.post('/login',  async (req, res) => {


        const { email, password } = req.body
        const user = await User.findOne({email})
        try {
            if(!user) {
                return res.status(401).json({message: 'Invalid credentials'})
            }
            
            if(password !== user.password) {
                return res.status(401).json({message: 'invalid credentials'})
            }
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                },
               
                'secret1234'
            )
            return res.json({ status: "ok", message: 'You have logged in successfully', user: token });
        } catch(error) {
            console.log(error)
            return res.status(401).json({message: 'Invalid credentials'})
        }
            
               
               
        }
        
)

route.get('/try', passport.authenticate('jwt', { session: false }), async (req, res) => {
   
    res.json({messgae: 'tried'})
})

export default route;