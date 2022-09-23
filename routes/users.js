import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Contact from "../models/Contact.js";

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

router.get("/users/:searchquery", (req, res, next) => {
  const { searchquery } = req.params;
  User.find({ username: { $regex: searchquery } }).then((users) => {
    res.json({ users });
  });
});

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
    var updated_users = [];
    for (var user of users) {
      if (user.username != currentusername)
        updated_users.push({
          username: user.username,
          profileimage: user.profileimage,
          status: await getStatus(currentusername, user.username),
        });
    }
    console.log("users-->", updated_users);
    res.json({ users: updated_users });
  });
});

export default router;
