import mongoose from  'mongoose';
const {Schema} = mongoose;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    userName:{
      type:String,
      unique:true,
      required:true,
    },
    password:{
       type:String,
       required:true,
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

export default User;