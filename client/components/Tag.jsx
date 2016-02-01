import React, { PropTypes } from 'react';

const Tag = ({
  children,
  active,
  onClick,
}) => {
  if (active) {
    return (
      <span>{children}</span>
      );
  }
  return (
    <a
      href="#"
      style={{
        background: '#eee',
        padding: '3px 7px',
        margin: '0 2px',
        overflow: 'auto',
      }}
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};
Tag.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

export default Tag;
