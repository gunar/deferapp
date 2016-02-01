import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TagList from '../components/TagList';
import * as CoinsActions from '../actions/CoinsActions';


const EntryTagList = ({
  tags,
  filters,
  dispatch,
}) => (
  <div>
    <TagList
      tags={
        tags.map(
          tag => ({
            name: tag,
            active: !!~filters.indexOf(tag),
            onClick: () => dispatch(CoinsActions.addFilter(tag)),
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

export default connect(select)(EntryTagList);
