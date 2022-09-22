import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = multer({ dest: "routes/uploads" });

var router = Router();
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.post("/signup", (req, res, next) => {
  return;
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
            token: jwt.sign(
              {
                username: user.username,
                password: user.password,
                profileurl: user.profileimage.url,
              },
              process.env.SECRET_KEY
            ),
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

router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.json({ logout: true, status: "You are successfully logged out!" });
});
export default router;
