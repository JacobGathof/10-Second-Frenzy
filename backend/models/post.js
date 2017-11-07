const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    timestamp: Date,
    content: String,
    link: String,
    author: String,
    likes: Number,
    dislikes: Number,
    shares: Number,
    reports: Number,
    comments: [String]
});

module.exports = mongoose.model('Post', postSchema);