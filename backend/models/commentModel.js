const mongoose = require("mongoose");

const commentModel = mongoose.Schema(
    {
        text: { type: String },
        courseId: { type: String },
        userId: { type: String },
        date: { type: Date },
        userName: { type: String }
    },
    { timestamps: true }
);
const Comment = mongoose.model("Comments", commentModel);
module.exports = Comment;
