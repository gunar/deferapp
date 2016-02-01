const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: Number,
  name: String,
  email: String,
  username: String,
  avatar: String,
  lastCrawl: {
    date: Date,
    error: Number
  },
  twitter: {},
  tokens: {}
});

UserSchema.index({ username: 1, uid: 1 });

mongoose.model('User', UserSchema);
