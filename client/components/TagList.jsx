import React, { PropTypes } from 'react';
import Tag from '../components/Tag';


const TagList = ({
  tags,
}) => (
  <div>
    {tags.map(tag => (
      <Tag
        key={tag.name}
        {...tag}
      >
        {tag.name}
      </Tag>
    ))}
  </div>
);
TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  // TODO: Array of Object of type X
};

export default TagList;
