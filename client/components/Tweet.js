import React, { PropTypes } from 'react';
// import TweetTagList from '../containers/TweetTagList';

const Tweet = ({
  tid,
  // tags,
  // value,
  // incrementIfOdd,
  // incrementAsync,
  // decrement,
  // counter,
}) => (
  <div className="entry">
    <p>Tweet {tid}</p>
    {/* <TweetTagList */}
    {/*   tags={tags} */}
    {/* /> */}
    {/* <p>$ {value}</p> */}
  </div>
);
Tweet.propTypes = {
  tid: PropTypes.number.isRequired,
  // tags: PropTypes.array.isRequired,
  // value: PropTypes.number.isRequired,
};

export default Tweet;
