import express from "express";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import contactRouter from "./routes/contacts.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authenticateRequest from "./Authenticate.js";
import addHeaders from "./helper.js";
import jwt from "jsonwebtoken";
dotenv.config();
const port = 3030;
const uri = process.env.MONGODB_URI;
//console.log(uri);
const connect = await Mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {}
);

const app = express();
app.use(bodyParser.json());
app.use(addHeaders);
app.use(authRouter);

app.use(authenticateRequest);

app.use(usersRouter);
app.use(messageRouter);
app.use(contactRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var userid_socket = {};
var socketid_userid = {};
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const user = jwt.verify(token, process.env.SECRET_KEY);
  //console.log("socket user is", user);
  if (user) {
    userid_socket[user.username] = socket;
    socketid_userid[socket.id] = user.username;
    next();
  }
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const username = socketid_userid[socket.id];
    userid_socket[username] = null;
    socketid_userid[socket.id] = null;
  });
  socket.on("message", (data) => {
    Message.create(JSON.parse(data)).then((msg) => {
      const username = msg.receiverUserName;
      if (userid_socket[username]) {
        userid_socket[username].send(JSON.stringify(msg));
      }
      socket.send(JSON.stringify(msg));
    });
  });
});

httpServer.listen(process.env.PORT || port, () => {
  Message.find({}).then((msg) => {});
});
