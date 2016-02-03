import React, { PropTypes } from 'react';

// List Layout
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';
import FontIcon from 'material-ui/lib/font-icon';

const iconButton = (
  <IconButton
    touch={true}
    iconClassName="material-icons"
    tooltip="more"
    tooltipPosition="bottom-left">
    more_vert
  </IconButton>
);
const rightIconMenu = (t) => (
  <IconMenu iconButtonElement={iconButton}>
    {t.url.length > 0 ? <MenuItem leftIcon={<FontIcon className="material-icons">link</FontIcon>}>Open URL</MenuItem> : null }
    {t.media.length > 0 ? <MenuItem leftIcon={<FontIcon className="material-icons">photo</FontIcon>}>Open Image</MenuItem> : null }
    <MenuItem leftIcon={<FontIcon className="material-icons">check</FontIcon>}>Archive</MenuItem>
  </IconMenu>
);
const TweetList = (t) => (
  <ListItem className="tweet"
    rightIconButton={rightIconMenu(t)}
    leftAvatar={<Avatar src={t.user.profile_image_url_https} />}
    primaryText={
      <div>{t.user.name}
      <span className="screen_name">@{t.user.screen_name}
        <span className="icons">
          {t.url.length > 0 ? <FontIcon className="material-icons">link</FontIcon> : null}
          {t.media.length > 0 ? <FontIcon className="material-icons">photo</FontIcon> : null}
        </span>
      </span>
      </div>
    }
    secondaryText={<p>{t.tweet.text}</p>}
    secondaryTextLines={2}
  />
);

// Card Layout
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

const cardStyle = {
  margin: "20px 10px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
}
const TweetCard = (t) => {
  const hasMedia = t.media.length > 0;
  const hasURL = t.url.length > 0;
  return (
    <Card style={cardStyle}>
        <CardHeader className="header"
          title={"@"+t.user.screen_name}
          subtitle={<span className="date">{new Date(t.tweet.created_at).toLocaleString()}</span>}
          avatar={t.user.profile_image_url_https}>
          <div style={{float: "right"}}>
            <IconButton
              iconClassName="material-icons"
              style={{margin: 0}}
              linkButton
              disabled={!t.url.length}
              href={t.url[0]}
              target="_blank"
            >
              launch
            </IconButton>
            <IconButton iconClassName="material-icons" style={{margin: 0}}>done</IconButton>
          </div>
        </CardHeader>
      { hasMedia ?
        <CardMedia overlay={<CardTitle subtitle={t.tweet.text} />}>
          <img src={t.media[0]} />
        </CardMedia>
      : <CardText>{t.tweet.text}</CardText> }
    </Card>
  );
};

const Tweet = TweetCard;
Tweet.propTypes = {
  tid: PropTypes.number.isRequired,
  // tags: PropTypes.array.isRequired,
  // value: PropTypes.number.isRequired,
};

export default Tweet;
