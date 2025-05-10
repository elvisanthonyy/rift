import express from 'express'
import { User } from '../models/userModel.js'
import { Profile } from '../models/profileModel.js'
import jwt from 'jsonwebtoken'

const route = express.Router()
route.use(express.json());

route.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
          
        const result = await Profile.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).json({status: 'error', message: "couldn't update profile" });
        }
        response.status(200).json({status: 'ok', message: "profile updated successfully" });
    } catch (error) {
        console.log(error)
        response.json({ status: "error", error: 'something is wrong' });
    }
})

export default route;