import React from 'react';
import { Paragraph } from 'grommet';
import Icon from './Icon';

export const components = {
  Icon: {
    component: Icon,
    name: 'Icon',
    properties: {
      color: ['-color-'],
      icon: ['-Icon-'],
      size: ['small', 'medium', 'large'],
    },
  },
  Repeater: {
    name: 'Repeater',
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Repeater is currently empty. Add some components to it so it can
        repeat them.
      </Paragraph>
    ),
    help: `Repeater is a designer specific component for
    use with this design tool. It expects a single child component which
    it will repeat 'count' times. Wrap it in a Box or Grid to control
    it's layout.`,
    defaultProps: {
      count: 2,
    },
    properties: {
      count: 2,
    },
    designProperties: {
      dataPath: '',
    },
  },
  Reference: {
    name: 'Reference',
    help: `Reference is a designer specific component for
    use with this design tool. It has a single property which is a reference
    to the component that should be used. Changes to that referenced component
    will be shown for all References to it.`,
    defaultProps: {
      includeChildren: true,
    },
    properties: {
      component: ['-reference-'],
      includeChildren: true,
    },
  },
  Screen: {
    name: 'Screen',
  },
};
