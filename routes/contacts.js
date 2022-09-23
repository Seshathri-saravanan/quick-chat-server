import { Router } from "express";
import bodyParser from "body-parser";
import User from "../models/User.js";
import Contact from "../models/Contact.js";

var router = Router();
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const getRequestFromContact = async (contact) => {
  var res = {};
  const user = await User.findOne({ username: contact.invitor });
  res = {
    username: user.username,
    profileimage: user.profileimage,
    id: contact._id,
    status: "accept",
  };
  return res;
};

router.get("/contacts", (req, res, next) => {
  const currentUsername = req.user.username;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  Contact.find({
    $or: [{ invitor: currentUsername }, { acceptor: currentUsername }],
    status: true,
  }).then(async (contacts) => {
    const usercontacts = [];
    for (var contact of contacts) {
      if (contact.acceptor == currentUsername)
        usercontacts.push(await User.findOne({ username: contact.invitor }));
      else
        usercontacts.push(await User.findOne({ username: contact.acceptor }));
    }
    res.json({ contacts: usercontacts });
  });
});

router.get("/contact/requests", (req, res, next) => {
  const currentUsername = req.user.username;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  Contact.find({ acceptor: currentUsername, status: false }).then(
    async (contacts) => {
      console.log("contactreqs", contacts);
      const usercontacts = [];
      for (var contact of contacts) {
        usercontacts.push(await getRequestFromContact(contact));
      }
      res.json({ requests: usercontacts });
    }
  );
});

router.post("/contact", (req, res, next) => {
  const invitor = req.user.username;
  const acceptor = req.body.acceptor;
  Contact.create({ invitor, acceptor }).then((contact) => {
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
  if (!contact || contact.acceptor != currentuser) {
    res.json({ success: false });
    return;
  }
  Contact.findOneAndUpdate(
    { _id: contact.id },
    {
      $set: {
        status: true,
      },
    }
  ).then(() => {
    res.json({ success: true });
  });
});

export default router;
