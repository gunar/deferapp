var express = require('express');
var mongoose = require('mongoose');

// var User = mongoose.model('User');
var api = express.Router();

var user = require('../controllers/user');



api.get('/', user.isAdmin, function (req, res, next) {
  var charts = [
    {
      type: 'Line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
      }
    }
  ];

  var head = '<head><script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script></head>';
  var body = charts.map((c, i) => ('<canvas id="' + i + '" width="'+(c.w || 400)+'" height="'+(c.h || 400)+'"></canvas>'));
  var script = (() => {
    const s = charts.map((c, i) => {
      const ctx = 'document.getElementById('+i+').getContext("2d")'
      const type = c.type || 'Line';
      const data = c.data || {};
      const options = c.options || {};
      return 'var chart'+i+' = new Chart('+ctx+').'+type+'('+JSON.stringify(data)+','+JSON.stringify(options)+');';
    });
    return '<script>' + s + '</script>';
  })();
  var html = '<html>' + head + body + script + '</html>';
  res.send(html);
});

module.exports = api;
