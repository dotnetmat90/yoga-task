const mongoose = require("mongoose");

const courseStatsModel = mongoose.Schema(
  {
    courseId: { type: Number},
    totalTime: { type: Number },
    users: { type: Array },
    likes: { type: Array }
  },
  { timestamps: true }
);
const CourseStats = mongoose.model("CourseStats", courseStatsModel);
module.exports = CourseStats;
