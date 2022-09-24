import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { getUserDetails } from "../helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getSignedToken = (user) => {
  return jwt.sign(
    {
      username: user.username,
      password: user.password,
      profileurl: user.profileimage.url,
    },
    process.env.SECRET_KEY
  );
};

var router = Router();
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email }).then((users) => {
    if (users.length != 0) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "user already exists" });
      return;
    }
  });
  const username = generateFromEmail(req.body.email);
  User.create({ ...req.body, username }).then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ account: { username: user.username } });
  });
});

router.get("/profileimage/:filename", (req, res) => {
  console.log("paranms", req.params);
  const generic_avatar = path.join(__dirname + "/public/images/avatar.png");
  const profile = path.join(__dirname + "/uploads/" + req.params.filename);
  res.sendFile(
    req.params.filename == "undefined" ? generic_avatar : profile,
    (err) => console.log("errio", err)
  );
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(
      (user) => {
        if (user.password != req.body.password) {
          return next(new Error("incorrect password"));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            token: getSignedToken(user),
            account: getUserDetails(user),
          });
          res.end();
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

export default router;
