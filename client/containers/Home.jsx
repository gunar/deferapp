import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ComposeForm from '../components/ComposeForm';
import VisibleEntriesList from './VisibleEntriesList';
import SelectedFilters from './SelectedFilters';
import { fetchEntries } from '../actions/CoinsActions';

class Home extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  static loadProps(params, cb) {
    fetchEntries(0, (err, entries) => {
      cb(null, entries);
    });
  }

  render() {
    return (
      <div>
        <ComposeForm />
        <SelectedFilters />
        <VisibleEntriesList />
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Home);
