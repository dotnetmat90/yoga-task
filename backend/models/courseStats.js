const mongoose = require("mongoose");

const courseStatsModel = mongoose.Schema(
  {
    totalTime: { type: Number },
    users: { type: Array }
  },
  { timestamps: true }
);
const CourseStats = mongoose.model("CourseStats", courseStatsModel);
module.exports = CourseStats;
