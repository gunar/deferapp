var fs = require('fs');
var path = require('path');

// Load all models
var load_models = function () {
  var rootPath = './server/models';
  fs.readdirSync(rootPath).forEach(function (file) {
    require('./' + path.join(rootPath, file));
  });
};

module.exports = {
  development: {
    db: "mongodb://localhost/rs",
    db_options: {},
    verbose: true,
    twitter: {
      consumerKey: "f9J4C23UwWA9MrVGbx2avyCQC",
      consumerSecret: "ITwNvslkGgIHHZX9gNURKU8kYI8ehpENW4RWMbDaqqa9ipySPg",
      callbackURL: "http://127.0.0.1:3000/auth/callback"
    },
    logs_dir: './logs/',
    load_models: load_models
  },
  production: { //TODO: Update for production
    db: (process.env.MONGODB_URL || "mongodb://localhost/") + 'rs',
    db_options: { db: { nativeParser: true } },
    verbose: true,
    twitter: {
      consumerKey: "AbKh5EG9HL4gMTIbxGcj6tO3R",
      consumerSecret: "coSjuX1B2XR6LdR860KdlLP3yGZdEquJUkMVQ06q7IX0355R4O",
      callbackURL: "http://www.deferapp.com/auth/callback"
    },
    logs_dir: process.env.OPENSHIFT_LOG_DIR,
    load_models: load_models
  }
};
