import express, { request } from "express";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Message, Conversation } from "../models/messagesModels.js";
import { Friend } from "../models/friendsModel.js";
import { Like } from "../models/postModel.js";
import jwt from "jsonwebtoken";
import passport from "../passport.js";

const route = express.Router();
route.use(express.json());

route.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      if (user) {
        await Post.create({
          post: req.body.post,
          author: {
            authorId: user._id,
            authorName: user.username,
          },
        });

        return res.json({ status: "okay" });
      } else {
        return res.json({ status: "error", message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = req.user;

      if (!user) {
        return res.json({ status: "error", message: "an error has occured" });
      }

      const post = await Post.findByIdAndUpdate(id, req.body);
      return res.json({
        status: "okay",
        message: "post has been edited successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = req.user;
      if (!user) {
        return res.json({ status: "error" });
      }

      const post = await Post.findById(id);

      const liked = await Like.findOne({ userId: user._id, postId: post._id });

      if (!liked) {
        const like = Like.create({
          userId: user._id,
          postId: post._id,
        });

        post.likes.push(user._id);
        user.posts.push(post._id);

        await post.save();
        await user.save();
        return res.json({ status: "liked" });
      } else {
        await Like.findByIdAndDelete(liked._id);
        post.likes.pull(user._id);

        await post.save();
        return res.json({ status: "unliked" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.get(
  "/friends",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.json({ status: "error" });
      }
      const friends = await Friend.find({ userId: user._id });
      const friendIds = friends.map((friend) => friend.friendId);
      const posts = await Post.find({ "author.authorId": { $in: friendIds } });
      return res.json({ status: "okay", posts: posts });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;

    try {
      const user = req.user;

      if (!user) {
        return res.json({ status: "error" });
      }
      await Post.findByIdAndDelete(id);
      await Like.deleteMany({ postId: id });
      return res.json({ message: "post has been deleted" });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

route.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      if (user) {
        const posts = await Post.find({ "author.authorId": user._id });

        return res.json({ status: "okay", posts: posts });
      }

      return res.json({ status: "error", message: "invalid user" });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error" });
    }
  }
);

export default route;
