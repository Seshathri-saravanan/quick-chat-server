import {Router} from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import passport from "passport";

var router = Router();
router.use(bodyParser.json());


router.post('/signup', (req, res, next) => {
   User.find({username:req.body.username}).then((users)=>{
      if(users.length!=0){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({message:"user already exists"});
        return;
      }
   })
   User.create(req.body).then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({account:{username:user.username}});
     
   });
 });
 
 router.post('/login', (req, res,next) => {
   console.log("login req",req.body)
  User.findOne({username:req.body.username})
  .then((user) => {
      console.log('user found ', user);
      if(user.password!=req.body.password){
        return next(new Error("incorrect password"));
      }
      else{
        res.statusCode = 200;
        res.cookie('user',user.username,{signed:true,maxAge:900000000,sameSite:"none",secure:true})
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.json({account:{username:user.username}});
        console.log("setting credn headers",res.getHeaders())
        
      }
      
  }, (err) => next(err))
  .catch((err) => next(err));
   
 });

 router.get('/logout',(req,res)=>{
    if(req.session){
       req.session.destroy();
       res.clearCookie('session-id');
       res.json({success: true, status: 'You are successfully logged out!'});
    }
 })

 export default router;