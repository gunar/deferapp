import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchTweets } from '../actions';
import VisibleTweetsList from './VisibleTweetsList';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {
  Paper,
  AppBar,
  Toolbar,
  ToolbarGroup,
  MenuItem,
  DropDownMenu,
  RaisedButton,
  SvgIcon,
} from 'material-ui/lib';


const TwitterIcon = (props) => (
  <SvgIcon {...props}>
  <path d="m 20.755574,2.4374398 c -0.809552,0.3589 -1.678655,0.60193 -2.591212,0.71137 0.931871,-0.55848 1.646466,-1.44367 1.98445,-2.49786005 C 19.276491,1.1675798 18.310822,1.5441898 17.282384,1.7453698 16.459956,0.86821975 15.286668,0.31939974 13.987843,0.31939974 c -2.493036,0 -4.512894,2.01986006 -4.512894,4.51290006 0,0.35408 0.040236,0.6985 0.11749,1.02843 -3.751625,-0.1883 -7.0767451,-1.98606 -9.30261211,-4.71568 -0.387877,0.66631 -0.61159001,1.44207 -0.61159001,2.26932 0,1.566 0.79667702,2.9469001 2.00859202,3.7564601 -0.740347,-0.0225 -1.43562901,-0.22694 -2.04400002,-0.56492 0,0.0193 0,0.037 0,0.0563 0,2.18724 1.55633702,4.0107501 3.62125902,4.4259801 -0.378221,0.10301 -0.777364,0.15773 -1.189382,0.15773 -0.291311,0 -0.572964,-0.0274 -0.849789,-0.0805 0.574573,1.79292 2.241961,3.09818 4.2167541,3.1352 -1.5466801,1.21031 -3.4925021,1.93134 -5.60731811,1.93134 -0.36373501,0 -0.72425201,-0.0209 -1.07672099,-0.0628 1.998935,1.28112 4.371262,2.02791 6.9190191,2.02791 8.301535,0 12.84179,-6.87718 12.84179,-12.8417902 0,-0.19636 -0.0048,-0.38949 -0.01288,-0.58423 0.881977,-0.63734 1.646466,-1.43241 2.251618,-2.33692" />
  </SvgIcon>
);

//  fill="#55ACEE"
class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(fetchTweets());
  }

  setFilter(filter) {
    const { dispatch } = this.props;
    dispatch({type: 'SET_FILTER', filter});
  };

  render() {
    const { visitor } = this.props;
    return (
      <Paper zDepth={2}>
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <DropDownMenu ref="filter_dropdown" value={this.props.activeFilter}>
              <MenuItem value={""} primaryText="Unread" onClick={ () => this.setFilter("") }/>
              <MenuItem value={"archived"} primaryText="Archived" onClick={ () => this.setFilter("archived") }/>
            </DropDownMenu>
          </ToolbarGroup>
          { visitor ?
            <ToolbarGroup lastChild float="right">
              <RaisedButton
                label="Login" primary={true}
                linkButton={true} href="/auth"
                icon={<TwitterIcon color="white" />}
              />
            </ToolbarGroup>
          : null }
        </Toolbar>
        <VisibleTweetsList />
      </Paper>
    );
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  visitor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
  activeFilter: state.filter.indexOf('archived') > -1 ? 'archived' : '',
});

export default connect(mapStateToProps)(App);
