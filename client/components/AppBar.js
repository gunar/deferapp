import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const AppBar = ({
  showArchived,
  dispatch,
}) => {
  const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
  return (
    <div className={ showArchived ? "appbar archive" : "appbar inbox" }>
      <div className="left">
        <div className={ showArchived ? "btn bullet active" : "btn bullet" } onClick={toggleFilter}>
          { showArchived ? "archive" : "inbox" }
        </div>
      </div>
      {/*<div className="brand middle">
        <img src="/logo_b.svg" style={{height: "2rem", marginBottom: "-.5rem"}} />
      </div>*/}
    </div>
  );
};

AppBar.propTypes = {
  action: PropTypes.func.isRequired,
  tid: PropTypes.number.isRequired,
  media: PropTypes.array.isRequired,
  url: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
  showArchived: state.filter.indexOf('archived') > -1,
});

export default connect(mapStateToProps)(AppBar);
