const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const UserWatchedCourses = require("../../models/userWatchModel");

router.get("/", async (req, res) => {
  try {
    let users = await User.find();
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(404).send({ message: "No records found" });
    }
  } catch (err) {
    res.status(404).send({ message: "There is some problem" });
  }
});

router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: "This user is already registered" });
  } else {
    user = new User(req.body);
    await user.save();
    return res.send(user);
  }
});

router.get("/courses/:id", async (req, res) => {
  let user = await UserWatchedCourses.find({ userId: req.params.id});
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "This user does not exist" });
  }
});

router.put("/courses/:id", async (req, res) => {
  let user = await UserWatchedCourses.findOneAndUpdate({ userId: req.params.id}, { $set: req.body }, { new: true });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "This user does not exist" });
  }
});

router.get("/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "This user does not exist" });
  }
});

router.put("/:id", async (req, res) => {
  const course = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  return res.send(course);
});


router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = await User.findOne({ email: email, password: password });
  if (user) {
    console.log(user);
    if (user.type == "" || !user.type) {
      user.type = "student";
    }
    const signedUser = {
      _id: user._id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
      type: user.type
    }
    const accessToken = jwt.sign(signedUser, process.env.SECRET_KEY);
    res.status(200).json({ accessToken: accessToken });
  } else {
    res.status(404).send({ message: "Invalid Password or Email" });
  }
});
module.exports = router;
