const mongoose = require("mongoose");

const courseModel = mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    createdBy: { type: String },
    image: { type: String },
    link: { type: String },
    videoUrl: { type: String },
    likes: { type: Number },
    watchedByNumber: { type: Number },
    views : {type: Number}
  },
  { timestamps: true }
);
const Course = mongoose.model("Courses", courseModel);
module.exports = Course;
