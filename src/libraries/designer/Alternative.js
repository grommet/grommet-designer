import { Children } from 'react';

const Alternative = ({ active, children }) => {
  return Children.toArray(children)[active - 1] || null;
};

export default Alternative;
