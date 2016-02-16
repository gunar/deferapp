import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';

import { closeReader } from '../actions';

const Reader = ({ isOpen, url, tid, dispatch }) => {
  const close = () => dispatch(closeReader());
  const archive = () => {};
  const listener = (e) => {
    var iframe = e.target;
    var url = "/api/tweetfetch/"+tid;
    console.log(url)
    return Promise.resolve(fetch(url, { credentials: 'same-origin' }))
      .then(function(response) {
        return response.text()
      })
      .then(html => {
        return iframe.contentDocument.body.innerHTML = html;
      })
      .catch(e => console.log(e));
  }
  return (
    <div className={ "reader" + (isOpen ? " open" : "") }>
      <div className="close_area" onClick={close}></div>
      <div className="controls">
      <div className="btn bullet" onClick={close}><a><i className="mdi mdi-arrow-left"/> Return</a></div>
        {/*<div className="btn bullet"><a><i className="mdi mdi-check"/> Archive</a></div>*/}
      </div>
      <div className="container">
        {/*{isOpen ? <iframe srcDoc={url} src={"/api/tweetfetch/"+tid} onLoad={listener}></iframe> : null }*/}
        {isOpen ? <iframe srcDoc={url} sandbox="allow-scripts" onLoad={listener}></iframe> : null }
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
