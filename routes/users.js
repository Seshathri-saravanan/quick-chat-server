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

router.get("/contacts", (req, res, next) => {
  const currentUsername = req.user.username;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  Contact.find({
    $or: [{ username1: currentUsername }, { username2: currentUsername }],
  }).then(async (contacts) => {
    const usercontacts = [];
    for (var contact of contacts) {
      const otherUser =
        contact.username1 == currentUsername
          ? contact.username2
          : contact.username1;
      console.log(otherUser);
      const user = await User.findOne({ username: otherUser });
      usercontacts.push(user);
    }
    res.json({ contacts: usercontacts });
  });
});

router.get("/users/:searchquery", (req, res, next) => {
  const { searchquery } = req.params;
  User.find({ username: { $regex: searchquery } }).then((users) => {
    res.json({ users });
  });
});

router.get("/users/", (req, res, next) => {
  User.find().then((users) => {
    res.json({ users });
  });
});

router.post("/contact", (req, res, next) => {
  const username1 = req.user.username;
  const username2 = req.body.username2;
  Contact.create({ username1, username2, status1: true }).then((contact) => {
    res.json(contact);
  });
});

router.get("/contactobjs", (req, res, next) => {
  Contact.find().then((contacts) => {
    res.json(contacts);
  });
});

router.post("/acceptcontact", async (req, res, next) => {
  const currentuser = req.user.username;
  var contact = await Contact.findById(req.body.contactId);
  var field = "status1";
  if (!contact) {
    res.json({ success: false });
    return;
  }
  if (currentuser == contact.username2) {
    field = "status2";
  }
  Contact.findOneAndUpdate(
    { _id: contact.id },
    {
      $set: {
        [field]: true,
      },
    }
  ).then(() => {
    res.json({ success: true });
  });
});

export default router;
