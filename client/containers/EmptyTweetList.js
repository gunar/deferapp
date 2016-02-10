import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const EmptyTweetList = ({
  isInbox,
}) => (
  <div style={{ textAlign: 'center' }}>
    <i className={ isInbox ? 'mdi mdi-inbox' : 'mdi mdi-archive'} style={{
      fontSize: 200,
    }}
    ></i>
    { isInbox ?
      <div>
        <p>This is your inbox.</p>
        <p>Here you'll find all Tweets you <i className="mdi mdi-heart" /> on Twitter.</p>
        <div><a target="_blank" href="https://twitter.com">Try now! <i className="mdi mdi-twitter" /></a></div>
      </div>
    :
      <div>
        <p>Your archive is empty</p>
      </div>
    }
  </div>
);

EmptyTweetList.propTypes = {
  isInbox: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const isInbox = state.filter.length === 0;
  return {
    isInbox,
  };
};
export default connect(mapStateToProps)(EmptyTweetList);
