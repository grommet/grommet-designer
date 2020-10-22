import React from 'react';
import ArrayProperty from './ArrayProperty';

const OptionsProperty = React.forwardRef(
  ({ first, multiple, name, onChange, options, sub, value }, ref) => {
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        sub={sub}
        first={first}
        multiple={multiple}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  },
);

export default OptionsProperty;
