import React, { PropTypes } from 'react';
// import TweetTagList from '../containers/TweetTagList';

// import ListItem from 'material-ui/lib/lists/list-item';
// import Avatar from 'material-ui/lib/avatar';
// const Tweet = (t) => (
//   <ListItem className="tweet"
//     leftAvatar={<Avatar src={t.user.profile_image_url_https} />}
//     primaryText={<div>{t.user.name} <span className="screen_name">@{t.user.screen_name}</span></div>}
//     secondaryText={<p>{t.tweet.text}</p>}
//     secondaryTextLines={1}
//   />
// );


import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

const Tweet = (t) => (
  <Card className="tweet">
    <CardHeader
      title={t.user.name}
      subtitle={"@"+t.user.screen_name}
      avatar={t.user.profile_image_url_https}
      actAsExpander={true}
      showExpandableButton={true}
    />
    {t.media.length > 0 ?
      <CardMedia expandable={true} overlay={<CardTitle subtitle={t.tweet.text}/>}>
        <img src={t.media[0]} />
      </CardMedia>
      : <CardText className="body" expandable={true}>{t.tweet.text}</CardText>
    }
  </Card>
);

Tweet.propTypes = {
  tid: PropTypes.number.isRequired,
  // tags: PropTypes.array.isRequired,
  // value: PropTypes.number.isRequired,
};

export default Tweet;
