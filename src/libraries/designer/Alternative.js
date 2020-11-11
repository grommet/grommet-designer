import { Children } from 'react';

const Alternative = ({ active, children }) => {
  if (Array.isArray(active)) {
    return Children.toArray(children).filter((_, i) => active.includes(i + 1));
  }
  return Children.toArray(children)[active - 1] || null;
};

export default Alternative;
