var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TweetSchema = new Schema({
  tid: Number,
  tweet: {},
  parsed: {},
  allowScript: Boolean,
});

TweetSchema.index({ tid: 1 });

mongoose.model('Tweet', TweetSchema);
