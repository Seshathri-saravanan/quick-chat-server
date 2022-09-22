import express from "express";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
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
const connect = await Mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {}
);

const app = express();
//app.options("*", cors());
//app.use(cors({ origin: true }));
app.use(bodyParser.json());

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

app.use(authRouter);

function auth(req, res, next) {
  try {
    const authtokens = req.headers.authorization.split(" ");
    if (authtokens.length <= 1) {
      next(new Error("UnAuthorized"));
      return;
    }
    const authtoken = authtokens[1];
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
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
}
app.use(auth);

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
    //console.log("message received from client",socket.id,data);
  });
});

httpServer.listen(process.env.PORT || port, () => {
  Message.find({}).then((msg) => {});
});
