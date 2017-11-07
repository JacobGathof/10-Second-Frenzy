const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: String,
    timestamp: Date,
    author: String,
    likes: Number,
    dislikes: Number,
    reports: Number
});

module.exports = mongoose.model('Comment', commentSchema);