import express from "express";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authenticateRequest from "./Authenticate.js";
import addHeaders from "./helper.js";

dotenv.config();
const port = 3030;
const uri = process.env.MONGODB_URI;
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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    Message.create(JSON.parse(data)).then((msg) =>
      io.sockets.send(JSON.stringify(msg))
    );
  });
});

httpServer.listen(process.env.PORT || port, () => {
  Message.find({}).then((msg) => {});
});
