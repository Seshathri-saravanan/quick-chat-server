import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import Mongoose from "mongoose";
import Message from "./models/Message.js";
import messageRouter from "./routes/messageRouter.js";
const app = express();
const port = 3000;
const uri = "mongodb+srv://sesha:sesha3@cluster0.ldwlw.mongodb.net/quick-chat-db?retryWrites=true&w=majority";
const connect = await Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },()=>{
   console.log("connected to the db server");
})
//connect(()=>{console.log("connected to the server")});
app.use(bodyParser.urlencoded({ extended: false }));
/*
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
app.use(messageRouter);
app.listen(port, () => {
   Message.find({}).then((msg)=>{
      console.log(msg);
   })
   console.log(`Example app listening at http://localhost:${port}`)
 })