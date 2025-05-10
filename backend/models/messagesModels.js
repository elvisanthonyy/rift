import mongoose from "mongoose";
import { User } from './userModel.js'

const messageSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true
        },
        conversationId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'conversation',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const conversationSchema = mongoose.Schema(
    {
        title: {
            type: String
        },
        participants: [{
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            name: String,
        }],
        messages:[{
            type: mongoose.Schema.Types.ObjectId, ref: 'message',
        }],
        
    },
    {
        timestamps: true,
    }
)

export const Message = mongoose.model('message', messageSchema)
export const Conversation = mongoose.model('conversation', conversationSchema)