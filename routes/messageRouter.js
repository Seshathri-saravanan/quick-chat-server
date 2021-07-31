import { Router } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
const messageRouter = Router();
messageRouter.use(bodyParser.json());
messageRouter.route("/account")
.get((req,res,next)=>{
    console.log("account reoute",req.user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({account:{username:req.user.username}});
})
messageRouter.route("/contacts")
.get((req,res,next)=>{
    console.log("contacts reoute");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    User.find({}).then((users)=>{
        console.log("contacts",users)
        res.json({contacts:users});
    })
    
})
messageRouter.route('/message')
.get((req,res,next) => {
   Message.find({})
    .then((messages) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({messages:messages});
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    console.log("req is",req.body)
   Message.create(req.body)
    .then((message) => {
        console.log('message Created ', message);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({message});
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
});

export default messageRouter;