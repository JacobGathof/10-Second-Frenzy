const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: String,
    timestamp: Date,
    author: User,
    likes: Number,
    dislikes: Number,
    reports: Number
});

module.exports = mongoose.model('Comment', commentSchema);