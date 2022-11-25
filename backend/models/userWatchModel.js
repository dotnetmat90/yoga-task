const mongoose = require('mongoose');

const userWatchesModel = mongoose.Schema({
    courseId: { type: String },
    date: { type: Date },
    isFinished: { type: Boolean },
    progress: { type: Number }
},
{ timestamps: true }
);
const UserWatchedCourses = mongoose.model('UserWatchedCourses', userWatchesModel);
module.exports = UserWatchedCourses;