import React from 'react';
import ArrayProperty from './ArrayProperty';

const OptionsProperty = React.forwardRef(
  ({ multiple, name, onChange, options, value }, ref) => {
    return (
      <ArrayProperty
        ref={ref}
        name={name}
        multiple={multiple}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
  },
);

export default OptionsProperty;
