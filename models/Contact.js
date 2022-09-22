import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;

var Contact = new Schema({
  username1: {
    type: String,
    required: true,
  },
  username2: {
    type: String,
    required: true,
  },
  status1: {
    type: Boolean,
    default: false,
  },
  status2: {
    type: Boolean,
    default: false,
  },
});

//User.plugin(passportLocalMongoose);

export default mongoose.model("Contact", Contact);
