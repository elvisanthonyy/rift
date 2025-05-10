import mongoose from "mongoose";
import { Profile } from './profileModel.js'
import { Friend } from './friendsModel.js'

const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        }, 
        email:{
            type: String,
            required: true,
            unique: true,
        }, 
        password: {
            type: String,
            required: true,
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'profile'
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'friend'
            },
        ],
        conversations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'conversation'
            },
        ],
        posts: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'post',
            required: true,
        }]


    },
    
    {
        timestamps: true,
    }
);

userSchema.pre('remove', async (doc) => {
    try{
        await doc.populate('profile')
    } catch (error) {
        console.log(error)
    }
})

export const User = mongoose.model('user', userSchema);