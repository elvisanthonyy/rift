import express, { request } from 'express'
import { Friend } from '../models/friendsModel.js'
import { User } from '../models/userModel.js'
import { Message, Conversation } from '../models/messagesModels.js';
import jwt from 'jsonwebtoken'
import passport from '../passport.js'
import { io, sendNotification} from '../socket.js'
const route = express.Router()
route.use(express.json());

route.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    

    try {
    
            
            const user = req.user

            const { id } = req.params;    
            const otherUser = await User.findById(id)
            const participants = [{ userId: user._id, name: user.username}, { userId: otherUser._id, name: otherUser.username}]

            const existingConversation = await Conversation.findOne({
                participants: { $all: participants}
            })

            

            if(existingConversation) {
                return res.json({error: 'convo exists'})
            } else {
                const conversation = new Conversation()

                conversation.participants.push({
                    $each: participants
                })

            
                const newConvo = await conversation.save()
            
                user.conversations.push(conversation._id)
                otherUser.conversations.push(conversation._id)

                await user.save()
                await otherUser.save()
                return res.json({status: 'ok', conversation: newConvo})
            }

    } catch (error) {
            console.log(error)
            res.json({ status: "error", error: 'cant create conversation' });
    }
})

route.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    

    try {
    
        const user = req.user

        const { id } = req.params;

        if(!user) {
            return res.json({ status: "error", message: 'could not delete message'});
        } else {
            await Message.findByIdAndDelete(id)
            return res.json({ status: "okay", message: 'message deleted'});
        }

        
    }  catch (error) {
        console.log(error)
        res.json({ status: "error", error: 'cant delete message' });
    }
})

route.post('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
    


    try {

        const user = req.user

        const { id } = req.params;

        const conversation = await Conversation.findById(id)

        const otherParticipandId = conversation.participants.filter(participant => participant.userId.toString() !== user._id.toString())

                

        const message = new Message({
            text: req.body.text,
            senderId: user._id,
            recipientId: otherParticipandId[0].userId,
            conversationId: id,
        })

        await message.save()

        sendNotification(message.recipientId, message)

        conversation.messages.push(message._id)

        await conversation.save()

        return res.json({status: 'messagee sent' })
        
    } catch (error) {
        console.log(error)
        return res.json({status: 'error'})
    }

})



export default route;