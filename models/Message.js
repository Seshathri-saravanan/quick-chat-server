import mongoose from  'mongoose';
const {Schema} = mongoose;
var Message = new Schema({
   senderUserName:{
      type:String,
      required:true,
   },
   receiverUserName:{
      type:String,
      required:true,
   },
   description:{
      type:String,
      required:true
   }
});

export default mongoose.model('Message',Message);