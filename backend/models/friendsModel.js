import mongoose from "mongoose";
import { User } from './userModel.js'


const friendSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true,
        },
        friendId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true,
        },
        consversationId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'conversation',
        }
        
    }
)

export const Friend = mongoose.model('friend', friendSchema)