var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TweetSchema = new Schema({
  tid: Number,
  uids: {
    starred: [Number],
    archived: [Number]
  },
  tweet: {},
  parsed: {}
});

TweetSchema.index({ tid: 1 });

mongoose.model('Tweet', TweetSchema);
