const mongoose = require('mongoose');

const userModelCourses = mongoose.Schema({
    userId: { type: String },
    likedCourses: { type: String },
    savedForLater:{ type: String },
},
    { timestamps: true }
);
const UserCourses = mongoose.model('UserCourses', userModelCourses);
module.exports = UserCourses;