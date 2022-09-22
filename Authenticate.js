import User from "./models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authenticateRequest(req, res, next) {
  try {
    const authtokens = req.headers.authorization.split(" ");

    if (authtokens.length <= 1) {
      throw "Unauthorized";
    }
    const authtoken = authtokens[1];
    var res = jwt.verify(authtoken, process.env.SECRET_KEY);

    if (res.username) {
      User.findOne({ username: res.username }).then((user) => {
        req.user = user;
        next();
      });
    } else {
      throw "Unauthorized";
    }
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
}
