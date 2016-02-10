import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Spinner from '../components/Spinner';

const LoadingSpinner = ({
  isLoading,
}) => (
  <div>
    { isLoading
      ? <Spinner />
      : ''
    }
  </div>
);

LoadingSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isLoading: state.loading,
});

export default connect(mapStateToProps)(LoadingSpinner);
