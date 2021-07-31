import mongoose from  'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const {Schema} = mongoose;

var User = new Schema({
    username:{
      type:String,
       unique:true,
       required:true
    },
    password:{
      type:String,
       required:true,
    }
});

//User.plugin(passportLocalMongoose);

export default mongoose.model('User',User);