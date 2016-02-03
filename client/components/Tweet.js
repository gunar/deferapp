import React, { PropTypes } from 'react';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import IconButton from 'material-ui/lib/icon-button';
import CardText from 'material-ui/lib/card/card-text';

const Tweet = ({
  action,
  tid,
  media,
  url,
  user,
  tweet,
}) => {
  const hasMedia = media.length > 0;
  const hasURL = url.length > 0;
  return (
    <Card className="twitter">
        <CardHeader className="header"
          title={'@' + user.screen_name}
          subtitle={<span className="date">{new Date(tweet.created_at).toLocaleString()}</span>}
          avatar={user.profile_image_url_https}
        >
          <div style={{ float: 'right' }}>
            <IconButton
              iconClassName="material-icons"
              style={{ margin: 0 }}
              linkButton
              disabled={!hasURL}
              href={url[0]}
              target="_blank"
            >
              launch
            </IconButton>
            <IconButton
              iconClassName="material-icons"
              style={{ margin: 0 }}
              onClick={ action }
            >
              done
            </IconButton>
          </div>
        </CardHeader>
      { hasMedia ?
        <CardMedia overlay={<CardTitle subtitle={tweet.text} />}>
          <img src={media[0]} />
        </CardMedia>
      : <CardText>{tweet.text}</CardText> }
    </Card>
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
