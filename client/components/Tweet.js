import React, { PropTypes } from 'react';
// import TweetTagList from '../containers/TweetTagList';

import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Colors from 'material-ui/lib/styles/colors';

const iconButton = (
  <IconButton
    touch={true}
    iconClassName="material-icons"
    tooltip="archive"
    iconStyle={{color: Colors.lightGreen600}}
    tooltipPosition="bottom-left">
    check
  </IconButton>
)

const Tweet = (t) => (
  <ListItem className="tweet"
    rightIconButton={iconButton}
    leftAvatar={<Avatar src={t.user.profile_image_url_https} />}
    primaryText={<div>{t.user.name} <span className="screen_name">@{t.user.screen_name}</span></div>}
    secondaryText={<p>{t.tweet.text}</p>}
    secondaryTextLines={2}
  />
);

Tweet.propTypes = {
  tid: PropTypes.number.isRequired,
  // tags: PropTypes.array.isRequired,
  // value: PropTypes.number.isRequired,
};

export default Tweet;
