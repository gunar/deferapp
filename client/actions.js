import fetch from 'isomorphic-fetch';
import {
  ADD_ENTRY,
  ADD_FILTER,
  REMOVE_FILTER,
  REQUEST_ENTRIES,
  RECEIVE_ENTRIES,
} from '../constants/ActionTypes';

export const requestEntries = () => ({
  type: REQUEST_ENTRIES,
});

export const receiveEntries = (json) => ({
  type: RECEIVE_ENTRIES,
  json,
  receivedAt: Date.now(),
});

export const fetchEntries = (page, cb) => {
  return fetch(`/api/entries`)
    .then(req => req.json())
    .then(
      json => {
        console.log(json);
        cb(null, json);
      },
      cb
    );
  // return dispatch => {
  //   dispatch(requestEntries());
  //   return fetch(`/api/entries`)
  //     .then(req => req.json())
  //     .then(json => dispatch(receiveEntries(json)));
  // };
};

export const addFilter = (tag) => ({
  type: ADD_FILTER,
  tag,
});

export const removeFilter = (tag) => ({
  type: REMOVE_FILTER,
  tag,
});

export const getEntriesFromGroup = (entries, group) => {
  if (group === undefined) return entries;

  // TODO: next
  return entries.filter(entry =>
      filters.reduce((prev, filter) => {
        if (prev === false) return false;
        return !!~entry.tags.indexOf(filter);
      }
      , true)
    );
};

// TODO: Move this somewhere else
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export const addEntry = (tagStr, valueStr) => {
  const tags = tagStr.split(',').map(t => t.trim());
  const value = parseFloat(valueStr);

  return {
    type: ADD_ENTRY,
    id: guid(),
    tags,
    value,
  };
};
