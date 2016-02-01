import React, { PropTypes } from 'react';
import EntryTagList from '../containers/EntryTagList';

const Entry = ({
  id,
  tags,
  value,
  // incrementIfOdd,
  // incrementAsync,
  // decrement,
  // counter,
}) => (
  <div className="entry">
    <EntryTagList
      tags={tags}
    />
    <p>$ {value}</p>
  </div>
);
Entry.propTypes = {
  id: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
};

export default Entry;
