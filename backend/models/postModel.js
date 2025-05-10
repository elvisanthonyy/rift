import mongoose from "mongoose";
import { User } from './userModel.js'

const postSchema = mongoose.Schema(
    {
        post:{
            type: String,
            required: true,
        }, 
        author:{
            authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
            authorName: String,
        }, 
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
        ],


    },
    {
        timestamps: true,
    }
)

const likeSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
            required: true,
        }, 
        postId:{
            type: mongoose.Schema.Types.ObjectId, ref: 'post',
            required: true,
        }, 
    },
    {
        timestamps: true,
    }
)

postSchema.pre('findByIdAndDelete', {document: false, query: true}, async function() {
    const doc = await this.model.findOne(this.getFilter());
    await Like.deleteMany({ postId: doc._id })
    consoloe.log('deleted likes')
})


export const Post = mongoose.model('post', postSchema)
export const Like = mongoose.model('like', likeSchema)