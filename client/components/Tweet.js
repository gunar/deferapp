import React, { PropTypes } from 'react';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import IconButton from 'material-ui/lib/icon-button';
import CardText from 'material-ui/lib/card/card-text';
import Snackbar from 'material-ui/lib/snackbar';

const Tweet = ({
  action,
  tid,
  media,
  url,
  user,
  tweet,
  tags,
}) => {
  const hasMedia = media.length > 0;
  const hasURL = url.length > 0;
  const hasTags = tags.length > 0;
  const isArchived = tags.indexOf('archived') > -1;
  const gotoURL = hasURL ? () => {window.open(url[0])} : null;
  return (
    <div className="tweet card">
      <div className="header">
        <div className="avatar"><img src={user.profile_image_url_https}/></div>
        <div className="info">{'@' + user.screen_name}<br/><span className="date">{new Date(tweet.created_at).toLocaleString()}</span></div>
        <div className="icons">
          <i className={hasURL ? "material-icons btn" : "material-icons btn disabled"} onClick={gotoURL}>launch</i>
          <i onClick={ action } className="material-icons btn">{ isArchived ? "move_to_inbox" : "done" }</i>
        </div>
      </div>
      <div className="body" style={{cursor: hasURL ? "pointer" : "default"}} onClick={gotoURL}>
        { hasMedia
          ? <div className="media"><img src={media[0]}/><div className="caption">{tweet.text}</div></div>
          : <div className="text">{tweet.text}</div> }
      </div>
    </div>
  );
};

Tweet.propTypes = {
  action: PropTypes.func.isRequired,
  tid: PropTypes.number.isRequired,
  media: PropTypes.array.isRequired,
  url: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  tweet: PropTypes.object.isRequired,
};

export default Tweet;
