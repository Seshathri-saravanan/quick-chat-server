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

router.get("/profileimage/:filename", (req, res) => {
  console.log("paranms", req.params);
  res.sendFile(
    path.join(__dirname + "/uploads/" + req.params.filename),
    (err) => console.log("errio", err)
  );
});

router.post(
  "/profileimage/:username",
  upload.single("myFile"),
  (req, res, next) => {
    console.log("in profileIMage", req.params);
    User.findOneAndUpdate(
      { username: req.params.username || "seshathri" },
      {
        $set: {
          profileimage: {
            url: path.join(__dirname + "/uploads/" + req.file.filename),
            filename: req.file.filename,
          },
        },
      }
    ).then((user) => console.log("user obj", user));
  }
);

export default router;
