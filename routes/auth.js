import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
  User.find({ username: req.body.username }).then((users) => {
    if (users.length != 0) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ message: "user already exists" });
      return;
    }
  });
  User.create(req.body).then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ account: { username: user.username } });
  });
});

router.get("/profileimage/:filename", (req, res) => {
  console.log("paranms", req.params);
  res.sendFile(
    path.join(__dirname + "/uploads/" + req.params.filename),
    (err) => console.log("errio", err)
  );
});

router.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(
      (user) => {
        if (user.password != req.body.password) {
          return next(new Error("incorrect password"));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            token: getSignedToken(user),
            account: {
              username: user.username,
              profileurl: user.profileimage.url,
            },
          });
          res.end();
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

export default router;
