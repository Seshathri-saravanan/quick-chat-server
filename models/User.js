import mongoose from  'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const {Schema} = mongoose;

var User = new Schema({
    
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User',User);