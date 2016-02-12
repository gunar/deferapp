var express = require('express');
var mongoose = require('mongoose');

var Log = mongoose.model('Log');
var api = express.Router();

var user = require('../controllers/user');


const x = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.round(Math.random() * 20));
  return date;
};
const y = () => (Math.round(Math.random() * 255));
api.get('/', user.isAdmin, function (req, res, next) {
  var data = (() => {
    'use strict';
    var o = [];
    for (let i = 0; i <= 20; i++) {
      o.push({
        x: x(),
        y: y()
      });
    }
    return o;
  })();
  var charts = [
    {
      type: 'line',
      data: {
        datasets: [{
          label: 'Dataset with date object point data',
          data: data
        }]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: "time",
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }, ],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            }
          }]
        }
      }
    }
  ];

  const script = s => '<script src="'+s+'"></script>';
  var head = '<head>'+script('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js')+script('https://raw.githubusercontent.com/nnnick/Chart.js/v2.0-dev/Chart.min.js')+'</head>';
  var body = charts.map((c, i) => ('<canvas id="' + i + '" width="'+(c.w || 400)+'" height="'+(c.h || 400)+'"></canvas>'));
  var chartScript = (() => {
    const s = charts.map((config, i) => {
      const ctx = 'document.getElementById('+i+').getContext("2d")'
      return 'var chart'+i+' = new Chart('+ctx+', '+JSON.stringify(config)+');';
    });
    return '<script>' + s + '</script>';
  })();
  var html = '<html>' + head + body + chartScript + '</html>';
  res.send(html);
});

module.exports = api;
