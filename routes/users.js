import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Contact from "../models/Contact.js";
import { getUserDetails } from "../helper.js";
import Image from "../models/Image.js";
import fs from "fs";
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

const getSearchUsers = async (users, currentusername) => {
  var updated_users = [];
  for (var user of users) {
    if (user.username != currentusername)
      updated_users.push({
        ...getUserDetails(user),
        status: await getStatus(currentusername, user.username),
      });
  }
  return updated_users;
};

router.post(
  "/profileimage/:username",
  upload.single("myFile"),
  async (req, res, next) => {
    console.log("in profileIMage", req.params);
    var obj = {
      name: req.file.filename,
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: req.file.mimetype,
      },
    };
    await Image.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
      }
    });
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
    ).then((user) => {
      res.sendStatus(200);
      console.log("user obj-->", user);
    });
  }
);

const getStatus = async (username1, username2) => {
  var contact = await Contact.findOne({
    acceptor: username1,
    invitor: username2,
  });
  if (contact) {
    if (contact.status) return "connected";
    return "accept";
  }
  var contact = await Contact.findOne({
    acceptor: username2,
    invitor: username1,
  });
  if (contact) {
    if (contact.status) return "connected";
    return "invited";
  }
  return "none";
};

router.get("/users/", (req, res, next) => {
  const currentusername = req.user.username;
  User.find().then(async (users) => {
    res.json({ users: await getSearchUsers(users, currentusername) });
  });
});

router.get("/users/:searchquery", (req, res, next) => {
  const { searchquery } = req.params;
  const currentusername = req.user.username;

  User.find({ username: { $regex: searchquery } }).then(async (users) => {
    res.json({ users: await getSearchUsers(users, currentusername) });
  });
});

export default router;
