import React, { PropTypes } from 'react';
import Entry from '../components/Entry';


const EntriesList = ({
  entries,
}) => (
  <div>
    {entries.map(entry => (
      <Entry
        key={entry.id}
        {...entry}
      />
    ))}
  </div>
);
EntriesList.propTypes = {
  entries: PropTypes.array.isRequired,
};

export default EntriesList;
