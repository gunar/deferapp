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

  const sendCharts = (datasets) => {
    var chart = {
      type: 'line',
      data: { datasets: datasets },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
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
              labelString: 'users'
            }
          }]
        }
      }
    };

    const script = s => '<script src="'+s+'"></script>';
    var head = '<head>'+script('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js')+script('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.0.0-beta2/Chart.min.js')+'</head>';
    var body = '<div style="width: 80%; height: 80%;"><canvas id="graph"></canvas></div>';
    const ctx = 'document.getElementById("graph").getContext("2d")'
    const chartScript = '<script>var chart = new Chart('+ctx+', '+JSON.stringify(chart)+');</script>';
    var html = '<html>' + head + body + chartScript + '</html>';
    res.send(html);
  };

  function datasetFor(type) {
    return Promise.resolve(Log.mapReduce({
      query: { type: type },
      map: function () {
        var date = new Date(this.date);
        var dateKey = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        emit(dateKey, 1);
      },
      reduce: function (k, values) {
        return values.length;
      },
    })).then(results => {
      var data = results.map(r => {
        return {
          x: new Date(r._id),
          y: r.value,
        };
      });
      return {
        label: type,
        data: data,
      };
    });
  }
  function randomColorFactor() {
    return Math.round(Math.random() * 255);
  }
  function randomColor(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
  }

  Promise.all([
    datasetFor('user_landed'),
    datasetFor('user_opened_reader'),
    datasetFor('user_signed_in'),
    datasetFor('user_archived_tweet'),
  ]).then(rawDatasets => {

    const getDates = dataset => dataset.data.map(d => d.x);

    const min = (cur, next) => next > cur ? cur : next;
    const max = (cur, next) => next < cur ? cur : next;

    const concat = (cur, next) => cur.concat(next);
    const getAllDates = dataset => dataset.map(getDates).reduce(concat, []);

    Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf())
      dat.setDate(dat.getDate() + days);
      return dat;
    }

    function makeRangeOfDays(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
      }
      return dateArray;
    }

    const parseDate = date => [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
    const dayExistsIn = (day, dataset) => {
      'use strict';
      const data = dataset.data;
      const date = parseDate(day);
      for (let i = 0; i < data.length; i++) {
        if (parseDate(data[i].x) == date) { return true; }
      }
      return false;
    };

    const firstDay = getAllDates(rawDatasets).reduce(min);
    const lastDay = getAllDates(rawDatasets).reduce(max);
    const range = makeRangeOfDays(firstDay, lastDay);

    const byX = (a, b) => a.x > b.x;

    const datasets = rawDatasets;

    // Fill missing days with y: 0
    datasets = datasets.map(dataset => {
      range.map(day => {
        if (!dayExistsIn(day, dataset)) {
          dataset.data.push({ x: day, y: 0 });
        }
      });
      dataset.data = dataset.data.sort(byX);
      return dataset;
    });


    datasets = rawDatasets.map(dataset => {
      // dataset.borderColor = randomColor(0.4);
      dataset.backgroundColor = randomColor(0.5);
      // dataset.pointBorderColor = randomColor(0.7);
      // dataset.pointBackgroundColor = randomColor(0.5);
      // dataset.pointBorderWidth = 1;
      return dataset;
    });

    sendCharts(datasets);

  }).catch(e => console.log(e));
});

module.exports = api;
