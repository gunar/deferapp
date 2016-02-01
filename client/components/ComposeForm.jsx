import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addEntry } from '../actions/CoinsActions'

const ComposeForm = ({
  dispatch
}) => {
  let tags, value;

  return (
    <div>
      <h1>New entry</h1>
      <input type="text" ref={node => {
        tags = node;
      }} placeholder="tag1, tag2, tag3..." />
      <input type="text" ref={node => {
        value = node;
      }} placeholder="0.00" />
      <button onClick={() => {
        dispatch(addEntry(tags.value, value.value));
        tags.value = '';
        value.value = '';
      }}>
        Add
      </button>
    </div>
  );
};
// Counter.propTypes = {
//   increment: PropTypes.func.isRequired,
//   incrementIfOdd: PropTypes.func.isRequired,
//   incrementAsync: PropTypes.func.isRequired,
//   decrement: PropTypes.func.isRequired,
//   counter: PropTypes.number.isRequired,
// };

export default connect()(ComposeForm);
