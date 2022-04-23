import React from 'react';
import { aliases, names, SelectLabel } from '../libraries/designer/Icon';
import ArrayProperty from './ArrayProperty';

const IconProperty = React.forwardRef(
  ({ name, onChange, value }, ref) => {
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        Label={SelectLabel}
        options={names}
        value={value}
        searchTest={(option, searchExp) =>
          aliases &&
          aliases[option] &&
          aliases[option].filter(a => searchExp.test(a)).length > 0
        }
        onChange={onChange}
      />
    );
  },
);

export default IconProperty;
