import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;

var Contact = new Schema({
  invitor: {
    type: String,
    required: true,
  },
  acceptor: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

//User.plugin(passportLocalMongoose);

export default mongoose.model("Contact", Contact);
