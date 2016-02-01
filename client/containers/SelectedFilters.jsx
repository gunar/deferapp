import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TagList from '../components/TagList';
import * as CoinsActions from '../actions/CoinsActions';


const SelectedFilters = ({
  filters,
  dispatch,
}) => (
  <div>
    {filters.length > 0 ? <h1>Active filters</h1> : ''}
    <TagList
      tags={
        filters.map(
          tag => ({
            name: tag,
            active: false,
            onClick: () => dispatch(CoinsActions.removeFilter(tag)),
          })
        )
      }
    />
  </div>
);
// {...bindActionCreators(CoinsActions, dispatch)}
// TagList.propTypes = {
//   tags: PropTypes.array.isRequired,
// };

const select = (state) => ({
  filters: state.filters,
});

export default connect(select)(SelectedFilters);
