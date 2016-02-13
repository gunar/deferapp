var express = require('express');
var mongoose = require('mongoose');

var Log = mongoose.model('Log');
var api = express.Router();

var user = require('../controllers/user');

const h = (el, attrs, children) => {
  if (!attrs) { attrs = {} };
  const props = Object.keys(attrs).map(k => [' ',k,'="',attrs[k],'"'].join(''));
  const propsStr = props.join('');
  return ['<',el,propsStr,'>',children,'</',el,'>'].join('');
}

const makeHTML = (datasets) => {
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

  const scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.0.0-beta2/Chart.min.js',
  ].map(s => h('script', {src: s})).join('');
  const head = h('head', null, scripts);

  const body = h('div', { style: 'width: 90%' },
                 h('canvas', { id: 'graph' }));

  const ctx = 'document.getElementById("graph").getContext("2d")'
  const chartScript = h('script', null, 'var chart = new Chart('+ctx+', '+JSON.stringify(chart)+');');

  var html = h('html', null, head + body + chartScript);
  return html;
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

const randomColorFactor = () => Math.round(Math.random() * 255);
const randomColor = opacity => 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';


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
const getDates = dataset => dataset.data.map(d => d.x);

const min = (cur, next) => next > cur ? cur : next;
const max = (cur, next) => next < cur ? cur : next;
const byX = (a, b) => a.x > b.x;

const concat = (cur, next) => cur.concat(next);
const getAllDates = dataset => dataset.map(getDates).reduce(concat, []);

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

api.get('/', user.isAdmin, function (req, res, next) {


  Promise.all([
    datasetFor('user_landed'),
    datasetFor('user_opened_reader'),
    datasetFor('user_signed_in'),
    datasetFor('user_archived_tweet'),
  ]).then(rawDatasets => {

    const firstDay = getAllDates(rawDatasets).reduce(min);
    const lastDay = getAllDates(rawDatasets).reduce(max);
    const range = makeRangeOfDays(firstDay, lastDay);

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

    const user_landed = rawDatasets[0];
    const user_opened_reader = rawDatasets[1];
    const user_signed_in = rawDatasets[2];
    const user_archived_tweet = rawDatasets[3];

    const cohortize = (stat, base) => {
      return stat.data.map(d => {
        d.y += base.data.filter(p => parseDate(p.x) == parseDate(d.x))[0].y;
        return d;
      });
    };

    const landed = {
      label: 'Landed',
      backgroundColor: randomColor(1),
      data: user_landed.data,
    };
    const engaged = {
      label: 'Engaged',
      backgroundColor: randomColor(1),
      data: cohortize(user_signed_in, landed),
    };

    const html = makeHTML([
      engaged,
      landed,
    ]);
    res.send(html);

  }).catch(e => console.log(e));
});

module.exports = api;
