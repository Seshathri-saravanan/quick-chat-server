import { Router } from "express";
import bodyParser from "body-parser";
import Message from "../models/Message.js";
import User from "../models/User.js";
const messageRouter = Router();
messageRouter.use(bodyParser.json());

messageRouter.route("/account").get((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    account: {
      username: req.user.username,
      profileimage: req.user.profileimage,
    },
  });
});

messageRouter
  .route("/message")
  .get((req, res, next) => {
    Message.find({})
      .then(
        (messages) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ messages: messages });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Message.create(req.body)
      .then(
        (message) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ message });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  });

export default messageRouter;
