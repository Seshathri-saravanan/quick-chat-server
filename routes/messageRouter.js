import { Router } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Message from "../models/Message.js";
const messageRouter = Router();
messageRouter.use(bodyParser.json());
messageRouter.route("/account")
.get((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({account:{username:req.user.username}});
})
messageRouter.route('/message')
.get((req,res,next) => {
   Message.find({})
    .then((messages) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var usermessages = [];
        for(var i=0;i<messages.length;i++){
           if(messages[i].senderUserName==req.user.username){
              usermessages.push(messages[i]);
           }
        }
        res.json(usermessages);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
   Message.create(req.body)
    .then((message) => {
        console.log('message Created ', message);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(message);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
});

export default messageRouter;