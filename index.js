import express from "express";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
import usersRouter from "./routes/users.js";
import session from "express-session";
import sessionFileStore from "session-file-store";
import User from "./models/User.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

dotenv.config();
const port = 3030;
const uri = process.env.MONGODB_URI;
console.log(uri);
const connect = await Mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {}
);

const app = express();
app.use(cookieParser(process.env.SECRET_KEY));
app.use(cors());
app.use(bodyParser.json());

/*
function addHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Accept-Version, Content-Length, Content-MD5, content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, DELETE, HEAD, PUT, PTIONS, POST"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", "1800");
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else next();
}
app.use(addHeaders);
app.use(addHeaders);
*/
app.use(usersRouter);
function auth(req, res, next) {
  const authtoken = req.headers.authorization.split(" ")[1];
  var res = jwt.verify(authtoken, process.env.SECRET_KEY);

  if (res.username) {
    User.findOne({ username: res.username })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => next(err));
  } else {
    next(new Error("UnAuthorized"));
  }
}
app.use(auth);

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
    //console.log("message received from client",socket.id,data);
  });
});

httpServer.listen(process.env.PORT || port, () => {
  Message.find({}).then((msg) => {});
});
