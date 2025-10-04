const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const authConfig = require('../config/config');
const tokenBlacklistSchema = Schema({
    date: {
        type: Date,
        default: Date.now,
        expires: "1h"
    },
    token: {
        type: String,
        required: true
    }
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
module.exports = TokenBlacklist;