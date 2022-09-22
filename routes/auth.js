import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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
