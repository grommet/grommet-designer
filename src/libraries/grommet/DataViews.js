import React from 'react';
import ArrayOfObjects from './ArrayOfObjects';
import DataViewProp from './DataView';

const DataViews = ({ value, onChange, ...rest }) => (
  <ArrayOfObjects
    name="views"
    itemKey="name"
    labelKey="name"
    value={value}
    Edit={DataViewProp}
    onChange={onChange}
    {...rest}
  />
);

export default DataViews;
