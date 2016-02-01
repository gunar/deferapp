const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagListScheme = new Schema({
  uid: Number,
  tid: Number,
  tags: [String]
});

TagListScheme.index({ tid: 1, uid: 1 });

mongoose.model('TagList', TagListScheme);
