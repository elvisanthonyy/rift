import express, { request } from "express";
import mongoose from "mongoose";
import { Friend } from "../models/friendsModel.js";
import { User } from "../models/userModel.js";
import { Message, Conversation } from "../models/messagesModels.js";
import jwt from "jsonwebtoken";
import passport from "../passport.js";

const route = express.Router();
route.use(express.json());

route.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const conversations = await Conversation.find({
        "participants.userId": user._id,
      });

      let titles = [];

      await Conversation.find({ "participants.userId": user._id })
        .populate("participants")
        .then((conversations) => {
          conversations.forEach((conversation) => {
            const otherParticipandId = conversation.participants.filter(
              (participant) =>
                participant.userId.toString() !== user._id.toString()
            );
            otherParticipandId.forEach((participant) => {
              titles.push(participant.name);
            });
          });
        });

      return res.json({
        status: "okay",
        titles: titles,
        conversations: conversations,
        userId: user._id,
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = req.user;

      if (user) {
        const conversation = await Conversation.findOne({ _id: id });
        const otherParticipandId = conversation.participants.filter(
          (participant) => participant.userId.toString() !== user._id.toString()
        );
        const messages = await Message.find({ conversationId: id });
        //const receiverMessages = await Message.find({conversationId : id, senderId: otherParticipandId[0].userId})

        return res.json({ status: "okay", messages: messages });
      } else {
        return res.json({ status: "error" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

//get conversation for mobile user
route.get(
  "/mobile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = req.user;

      if (user) {
        const conversation = await Conversation.findOne({ _id: id });

        return res.json({
          status: "okay",
          conversation: conversation,
          user: user,
        });
      } else {
        return res.json({ status: "error" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

export default route;
