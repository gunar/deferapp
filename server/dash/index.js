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

const datasetFor = type =>
  Promise.resolve(
    Log.mapReduce(
      {
        query: { type: type },
        map: function () {
          var date = new Date(this.date);
          var dateKey = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
          emit(dateKey, 1);
        },
        reduce: function (k, values) {
          return values.length;
        },
      }
    )
  ).then(results => results.map(o => ({ date: o._id, value: o.value })));

const uniqueUserVisitsByDay = () =>
  Promise.resolve(
    Log.mapReduce(
      {
        query: { type: 'request', 'data.url': '/' },
        map: function () {
          var date = new Date(this.date);
          var dateKey = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
          emit(dateKey, this.data.uid || 0);
        },
        reduce: function (k, values) {
          var uniques = [];
          for (var i = 0; i < values.length; i++) {
            if (uniques.indexOf(values[i]) == -1) {
              uniques.push(values[i]);
            }
          }
          return { uniques: uniques.length };
        },
      }
    )
  ).then(results => results.map(o => ({ date: o._id, value: (o.value.uniques || 1) })));

const uniqueUserActionsByDay = action =>
  Promise.resolve(
    Log.mapReduce(
      {
        query: { type: action },
        map: function () {
          var date = new Date(this.date);
          var dateKey = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
          emit(dateKey, this.data.uid || 0);
        },
        reduce: function (k, values) {
          var uniques = [];
          for (var i = 0; i < values.length; i++) {
            if (uniques.indexOf(values[i]) == -1) {
              uniques.push(values[i]);
            }
          }
          return { uniques: uniques.length };
        },
      }
    )
  ).then(results => results.map(o => ({ date: o._id, value: (o.value.uniques || 1) })));

const uniqueUserReadsByDay = () => uniqueUserActionsByDay('user_opened_reader');
const uniqueUserArchivesByDay = () => uniqueUserActionsByDay('user_archived_tweet');

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
    dateArray.push(new Date (currentDate))
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

const min = (cur, next) => next > cur ? cur : next;
const max = (cur, next) => next < cur ? cur : next;
const byDate = (a, b) => a.date > b.date;

const concat = (cur, next) => cur.concat(next);
const getDates = dataset => dataset.map(o => new Date(o.date));
const getAllDates = datasets => datasets.map(getDates).reduce(concat, []);

const parseDate = date => [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-');
const dayExistsIn = (day, dataset) => {
  'use strict';
  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].date == day) { return true; }
  }
  return false;
};

api.get('/', user.isAdmin, function (req, res, next) {


  Promise.all([
    datasetFor('user_landed'),
    datasetFor('user_signed_in'),
    uniqueUserVisitsByDay(),
    uniqueUserReadsByDay(),
    uniqueUserArchivesByDay(),
    // datasetFor('user_opened_reader'),
    // datasetFor('user_archived_tweet'),
  ]).then(rawDatasets => {

    const firstDay = getAllDates(rawDatasets).reduce(min);
    const lastDay = getAllDates(rawDatasets).reduce(max);
    const range = makeRangeOfDays(firstDay, lastDay);

    const toTypeDate = o => ({ date: new Date(o.date), value: o.value });
    const toGraph = item => ({ x: item.date, y: item.value });

    // Fill missing days with y: 0
    const datasets = rawDatasets.map(dataset => {
      range
        .map(day => parseDate(day))
        .map(day => {
          if (!dayExistsIn(day, dataset)) {
            dataset.push({ date: day, value: 0 });
          }
        });
      return dataset.map(toTypeDate).sort(byDate).map(toGraph);
    });

    const user_landed = datasets[0];
    const user_signed_in = datasets[1];
    const unique_user_visits = datasets[2];
    const unique_user_read = datasets[3];
    const unique_user_archives = datasets[4];

    const cohortize = (stat, base) => {
      return stat.map(d => {
        d.y += base.data.filter(p => parseDate(p.x) == parseDate(d.x))[0].y;
        return d;
      });
    };

    // Aquisition: Unique users to land in the site
    const landed = {
      label: 'Acquired: Landed',
      backgroundColor: randomColor(1),
      data: user_landed,
    };
    const engaged = {
      label: 'Acquired: Engaged',
      backgroundColor: randomColor(1),
      data: cohortize(user_signed_in, landed),
    };
    const activated_1 = {
      label: 'Activated: Open',
      backgroundColor: randomColor(1),
      data: cohortize(unique_user_visits, engaged),
    };
    const activated_2 = {
      label: 'Activated: Read',
      backgroundColor: randomColor(1),
      data: cohortize(unique_user_read, activated_1),
    };
    const activated_3 = {
      label: 'Activated: Archived',
      backgroundColor: randomColor(1),
      data: cohortize(unique_user_archives, activated_2),
    };

    const html = makeHTML([
      activated_3,
      activated_2,
      activated_1,
      engaged,
      landed,
    ]);

    res.send(html);

  }).catch(e => console.log(e));
});

module.exports = api;
