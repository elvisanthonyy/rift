import express from 'express'
import { User } from '../models/userModel.js'
import { Profile } from '../models/profileModel.js'
import { Friend } from '../models/friendsModel.js'
import { Conversation } from '../models/messagesModels.js'
import jwt from 'jsonwebtoken'
import passport from '../passport.js'

const route = express.Router()
route.use(express.json());

route.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    

    try {

        
        const user = req.user

        const friends = await Friend.find({userId: user._id})

        return res.json({status: 'okay', friends: friends})
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'something is wrong' });
    }
})



route.post('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    

    try {

     
        const user = req.user

        const { id } = req.params;
          
        const addedUser = await User.findById(id);
        
        //getting participant to create convo
        const participants = [{ userId: user._id, name: user.username}, { userId:addedUser._id, name: addedUser.username}]


        const existingFriends = await Friend.findOne({
            $or:[
                { userId: user._id, friendId: addedUser._id },
                { userId: addedUser._id, friendId: user._id },
            ]
        })

        if(!existingFriends){
            const friend = new Friend({
                username: addedUser.username,
                email: addedUser.email,
                userId: user._id,
                friendId: addedUser._id,
            })
    
            const oppFriend = new Friend({
                username: user.username,
                email: user.email,
                userId: addedUser._id,
                friendId: user._id,
            })
    
            
            
            //push iDs
            user.friends.push(friend._id)
            addedUser.friends.push(oppFriend._id)

            //create conversation with the new friends
            const conversation = new Conversation()
            conversation.participants.push({
                $each: participants
            })

            //push conversations ids to users conversation array
            user.conversations.push(conversation._id)
            addedUser.conversations.push(conversation._id)
 
            //add coversation Id to friend

            friend.consversationId = conversation._id
            oppFriend.consversationId = conversation._id

            await friend.save()
            await oppFriend.save()

            await user.save()
            await addedUser.save()

           

            

            await conversation.save()
            
                
            return res.status(200).json({status: 'ok', name: addedUser.username})

        } else {
            return res.status(200).json({status: 'error', name: addedUser.username})
        }

        
    } catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'something is wrong' });
    }
})

export default route;
