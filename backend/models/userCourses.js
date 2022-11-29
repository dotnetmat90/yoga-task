const mongoose = require('mongoose');

const userModelCourses = mongoose.Schema({
    userId: { type: String },
    likedCourses: { type: Array },
    savedForLater: { type: Array }
},
    { timestamps: true }
);
const User = mongoose.model('UserCourses', userModelCourses);
module.exports = User;