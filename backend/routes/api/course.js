const express = require("express");
const router = express.Router();
const Course = require("../../models/courseModel");
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const { isBuffer } = require("util");
const upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.path.replace('/', '');
  console.log(id);
  let user = await Course.findById(id);
  if (user) {
    if (user.videoUrl) {
      user.videoUrl = 'http://localhost:4000/' + user.videoUrl;
      user.videoUrl =user.videoUrl.replace("\\", "/");
    }
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: "This user does not exist" });
  }
});


router.delete("/:id", async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  return res.send(course);
});

router.put("/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  return res.send(course);
});

router.put("/likes/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  return res.send(course);
});

router.put("/views/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  return res.send(course);
});

router.get("/", async (req, res) => {
  try {
    let courses = await Course.find();
    if (courses.length > 0) {

      courses.forEach(course => {
        if (course.videoUrl) {
          course.videoUrl = 'http://localhost:4000/' + course.videoUrl;
        }
      })
      res.status(200).send(courses);
    } else {
      res.status(404).send({ message: "No records found" });
    }
  } catch (err) {
    res.status(404).send({ message: "There is some problem" });
  }
});



router.post('/', upload.single('myFile'), async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);



  let course = await Course.findOne({ name: req.body.name });
  if (course) {
    return res.status(400).send({ message: "This Course is already registered" });
  } else {
    console.log(req)
    if(req.file) {
    req.body.videoUrl = req.file.path;
    }
    course = new Course(req.body);
    await course.save();
    return res.send(course);
  }

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})


module.exports = router;
