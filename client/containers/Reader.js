import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { archiveTweet, closeReader } from '../actions';

const Reader = ({
  isOpen,
  url,
  tid,
  allowScript,
  dispatch,
}) => {
  const close = () => dispatch(closeReader());
  const open = () => window.open(url);
  const archive = () => {
    dispatch(archiveTweet(tid));
    dispatch(closeReader());
  };
  const sandbox = 'allow-popups allow-same-origin' + ( allowScript ? ' allow-scripts' : '');
  return (
    <div className={ "reader" + (isOpen ? " open" : "") }>
      <div className="close_area" onClick={close}></div>
      <div className="controls">
      <div className="btn bullet" onClick={close}><a><i className="mdi mdi-arrow-left"/> Return</a></div>
      <div className="btn bullet" onClick={open}><a><i className="mdi mdi-open-in-new"/> Open</a></div>
      <div className="btn bullet" onClick={archive}><a><i className="mdi mdi-check"/> Archive</a></div>
      </div>
      <div className="container">
        {isOpen ? <iframe sandbox={sandbox} referrerpolicy="no-referrer" src={"/api/fetch/"+tid}></iframe> : null }
      </div>
    </div>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  tid: PropTypes.number.isRequired,
  allowScript: PropTypes.bool.isRequried,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isOpen: state.reader.isOpen,
  url: state.reader.url,
  tid: state.reader.tid,
  allowScript: state.reader.allowScript,
});

export default connect(mapStateToProps)(Reader);
