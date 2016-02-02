import React, { PropTypes } from 'react';
// import TweetTagList from '../containers/TweetTagList';

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


const Tweet = (t) => (
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

Tweet.propTypes = {
  tid: PropTypes.number.isRequired,
  // tags: PropTypes.array.isRequired,
  // value: PropTypes.number.isRequired,
};

export default Tweet;
