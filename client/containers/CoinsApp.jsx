import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ComposeForm from '../components/ComposeForm';
import VisibleEntriesList from './VisibleEntriesList';
import SelectedFilters from './SelectedFilters';
import { fetchEntries } from '../actions/CoinsActions';

class CoinsApp extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchEntries());
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

CoinsApp.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CoinsApp);
