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
import cookieParser from "cookie-parser";
const fileStore = sessionFileStore(session);

const port = 3030;
const uri = "mongodb+srv://sesha:sesha3@cluster0.ldwlw.mongodb.net/quick-chat-db?retryWrites=true&w=majority";
const connect = await Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },()=>{
  // console.log("connected to the db server");
})

const app = express();
/*
app.use(cors(
  {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,// For legacy browser support
    methods: "GET, POST",
    allowedHeaders:"",
    
  }
));
*/
app.use(cookieParser("oisdfbkdufhejbfibufgvfuvsfu"));

function addHeaders(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','https://quick-chat-2021.herokuapp.com',);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  console.log("setting acces con c header as true",req.headers,res.headers);
  next();
}
app.use(addHeaders)
app.use(usersRouter);
function auth(req,res,next){
  console.log("signedcookies",req.signedCookies)
  if(req.signedCookies.user){
    var username = req.signedCookies.user;
    User.findOne({username:username}).then(user=>next()).catch(err=>next(err));
  }
  else{
    next(new Error("UnAuthorized"));
  }
}
app.use(auth);

app.use(messageRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: {
     origin: "*",
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