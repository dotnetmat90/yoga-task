const mongoose = require('mongoose');

const coursePathModel = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    courses: { type: Array}
},
    { timestamps: true }
);
const CoursePathModel = mongoose.model('CoursePathModel', coursePathModel);
module.exports = CoursePathModel;