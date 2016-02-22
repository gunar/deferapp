import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const AppBar = ({
  showArchived,
  dispatch,
}) => {
  const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
  return (
    <div className={ showArchived ? 'appbar archive' : 'appbar inbox' }>
      <div className="left">
        <div className={ showArchived ? 'btn bullet active' : 'btn bullet' } onClick={toggleFilter}>
          <a>{ showArchived ? 'archvie' : 'inbox' }</a>
        </div>
      </div>
    </div>
  );
};

AppBar.propTypes = {
  showArchived: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
  showArchived: state.filter.indexOf('archived') > -1,
});

export default connect(mapStateToProps)(AppBar);
