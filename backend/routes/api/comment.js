const express = require("express");
const router = express.Router();
const Comment = require("../../models/commentModel");


router.get("/:id", async (req, res) => {
  let user = await Comment.findById(req.params.id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "This user does not exist" });
  }
});

router.put("/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  return res.send(comment);
});

router.get("/", async (req, res) => {
  try {
    let comments = await Comment.find().sort({_id: 'desc'});
    if (comments.length > 0) {
      res.status(200).send(comments);
    } else {
      res.status(404).send({ message: "No records found" });
    }
  } catch (err) {
    res.status(404).send({ message: "There is some problem" });
  }
});

router.post("/", async (req, res) => {
  const comment = new Comment(req.body);
  await comment.save();
  return res.send(comment);
});

module.exports = router;
