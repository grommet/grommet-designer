import React from 'react';

const Repeater = ({ children, count }) => {
  let contents = [];
  if (React.Children.count(children) === 1) {
    const child = React.Children.toArray(children)[0];
    contents.push(child);
    for (let i = 1; i < count; i += 1) {
      contents.push(React.cloneElement(child, { key: i }));
    }
  } else {
    contents = children;
  }
  return contents;
};

export default Repeater;
