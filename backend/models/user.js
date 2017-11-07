const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    friends: [String]
});

module.exports = mongoose.model('User', userSchema);