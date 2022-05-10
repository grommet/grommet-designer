import React from 'react';
import { Button } from 'grommet';
import { Edit } from 'grommet-icons';
import { aliases, names, SelectLabel } from '../libraries/designer/Icon';
import ArrayProperty from './ArrayProperty';
import DataPathField from './DataPathField';

const IconProperty = React.forwardRef(({ name, onChange, value }, ref) => {
  if (value === '' || value?.[0] === '{')
    return <DataPathField name={name} onChange={onChange} value={value} />;

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
        aliases[option].filter((a) => searchExp.test(a)).length > 0
      }
      onChange={onChange}
    >
      {!value && <Button icon={<Edit />} onClick={() => onChange('{}')} />}
    </ArrayProperty>
  );
});

export default IconProperty;
