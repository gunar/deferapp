import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { closeReader } from '../actions';

const Reader = ({
  isOpen,
  url,
  dispatch,
}) => {
  return (
    <div className={ "reader" + (isOpen ? " open" : "") }>
      <div className="close_area" onClick={ () => dispatch(closeReader())}></div>
      <div className="container">
        {isOpen ? <iframe src={url}></iframe> : null }
      </div>
    </div>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isOpen: state.reader.isOpen,
  url: state.reader.url,

});

export default connect(mapStateToProps)(Reader);
