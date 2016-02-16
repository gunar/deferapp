import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';

import { closeReader } from '../actions';

const Reader = ({ isOpen, url, tid, dispatch }) => {
  const close = () => dispatch(closeReader());
  const archive = () => {};
  return (
    <div className={ "reader" + (isOpen ? " open" : "") }>
      <div className="close_area" onClick={close}></div>
      <div className="controls">
      <div className="btn bullet" onClick={close}><a><i className="mdi mdi-arrow-left"/> Return</a></div>
        {/*<div className="btn bullet"><a><i className="mdi mdi-check"/> Archive</a></div>*/}
      </div>
      <div className="container">
        {isOpen ? <iframe src={"/api/tweetfetch/"+tid}></iframe> : null }
      </div>
    </div>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  tid: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isOpen: state.reader.isOpen,
  url: state.reader.url,
  tid: state.reader.tid,
});

export default connect(mapStateToProps)(Reader);
