import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
import usersRouter from "./routes/users.js";
import passport from "passport";
import session from "express-session";
import sessionFileStore from "session-file-store";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/User.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
const fileStore = sessionFileStore(session);
const app = express();
app.use(cors());
const port = 3030;
const uri = "mongodb+srv://sesha:sesha3@cluster0.ldwlw.mongodb.net/quick-chat-db?retryWrites=true&w=majority";
const connect = await Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },()=>{
  // console.log("connected to the db server");
})
//connect(()=>{console.log("connected to the server")});
/*
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
   name:"session-id",
   secret:"bdsfmbsdfmnb3112",
   saveUninitialized:false,
   resave:false,
   store:new fileStore()
}))
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
function auth (req, res, next) {
   console.log(req.user);

   if (!req.user) {
     var err = new Error('You are not authenticated!');
     err.status = 403;
     next(err);
   }
   else {
         next();
   }
}

app.use(auth);
*/
app.use(usersRouter);
app.use(messageRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: {
     origin: ["http://localhost:3000","https://quick-chat-2021-server.herokuapp.com"],
     methods: ["GET", "POST"]
   }
 });
 
 io.on("connection", (socket) => {
   console.log("connected with socket",socket.id);
   socket.on("message",data=>{
     Message.create(JSON.parse(data)).then(msg=>console.log("msg added to db",msg));
     //console.log("message received from client",socket.id,data);
     io.sockets.send(data);
    })
 });
 
httpServer.listen(process.env.PORT || port, () => {
   Message.find({}).then((msg)=>{
      //console.log(msg);
   })
   console.log(`Example app listening at http://localhost:${port}`)
 })