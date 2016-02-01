var fs = require('fs');

// Load all models
var load_models = function () {
  var path = './server/models';
  fs.readdirSync(path).forEach(function (file) {
    require(path+'/'+file);
  });
};

module.exports = {
  development: {
    db: "mongodb://localhost/rs",
    verbose: true,
    twitter: {
      consumerKey: "f9J4C23UwWA9MrVGbx2avyCQC",
      consumerSecret: "ITwNvslkGgIHHZX9gNURKU8kYI8ehpENW4RWMbDaqqa9ipySPg",
      callbackURL: "http://127.0.0.1:3000/auth/callback"
    },
    logs: './logs/',
    load_models: load_models
  },
  production: { //TODO: Update for production
    db: "mongodb://localhost/rs",
    verbose: true,
    twitter: {
      consumerKey: "f9J4C23UwWA9MrVGbx2avyCQC",
      consumerSecret: "ITwNvslkGgIHHZX9gNURKU8kYI8ehpENW4RWMbDaqqa9ipySPg",
      callbackURL: "http://127.0.0.1:3000/auth/callback"
    },
    logs: './logs/',
    load_models: load_models
  }
};
