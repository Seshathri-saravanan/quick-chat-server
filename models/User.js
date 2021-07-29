import mongoose from  'mongoose';
const {Schema} = mongoose;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User',User);