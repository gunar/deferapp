import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import EntriesList from '../components/EntriesList';
import { getVisibleEntries } from '../actions/CoinsActions';

class VisibleEntriesList extends Component {

  render() {
    const { entries } = this.props;
    return (
      <div>
        <h1>Entries</h1>
        <EntriesList
          entries={entries}
        />
      </div>
    );
  }
}
VisibleEntriesList.propTypes = {
  entries: PropTypes.array.isRequired,
};
// VisibleEntriesList.defaultProps = {
//   entries: {}
// };

const select = (state) => ({
  entries: getVisibleEntries(state.entries, state.filters),
});

export default connect(select)(VisibleEntriesList);
