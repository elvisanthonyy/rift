import mongoose from "mongoose";
import { User } from './userModel.js'

const profileSchema = mongoose.Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        location: {
            type: String
        },
        dateOfBirth: {
            type: Date
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true
        }

    }
)

export const Profile = mongoose.model('profile', profileSchema)