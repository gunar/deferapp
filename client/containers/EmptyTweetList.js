import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const EmptyTweetList = ({
  isInbox,
  isLoading,
  hasTweets,
}) => {
  if (isLoading || hasTweets) {
    return <div />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <i className={ isInbox ? 'mdi mdi-inbox' : 'mdi mdi-archive'} style={{
        fontSize: 200,
        lineHeight: '150px',
      }}
      ></i>
      { isInbox ?
        <div>
        <p style={{ marginBottom: '3em' }}>You're inbox is empty.</p>
        <p><a target="_blank" className="btn sqrd" href="https://twitter.com">Go <i className="mdi mdi-heart" /> something</a></p>
        <p style={{ fontSize: 'small' }}>(usually take less than a minute to sync with Twitter)</p>
        </div>
          :
            <div>
            <p>Your archive is empty</p>
            </div>
      }
    </div>
  );
};

EmptyTweetList.propTypes = {
  isInbox: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const isInbox = state.filter.length === 0;
  const isLoading = state.loading;
  const hasTweets = state.tweets.length > 0;
  return {
    isInbox,
    isLoading,
    hasTweets,
  };
};
export default connect(mapStateToProps)(EmptyTweetList);
