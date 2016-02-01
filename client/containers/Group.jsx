import React from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
// import { routeActions } from 'react-router-redux';

import EntriesList from '../components/EntriesList';
import { getEntriesFromGroup } from '../actions/CoinsActions';

const Group = ({
  groupId,
  entries,
}) => {
  return (
    <div>
      <h1>Group {groupId}</h1>
      <EntriesList
        entries={entries}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  groupId: ownProps.params.groupId,
  entries: getEntriesFromGroup(state.entries, ownProps.params.groupId),
});

export default connect(mapStateToProps)(Group);
