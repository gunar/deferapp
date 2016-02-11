const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogScheme = new Schema({
  type: String,
  date: { type: Date, default: Date.now },
  data: Schema.Types.Mixed
});

LogScheme.index({ type: 1, date: 1 });

mongoose.model('Log', LogScheme);
