import React from 'react';
import { Paragraph } from 'grommet';
import Alternative from './Alternative';
import Icon from './Icon';
import IFrame from './IFrame';

export const components = {
  Alternative: {
    component: Alternative,
    name: 'Alternative',
    container: true,
    selectable: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Alternative is currently empty. Add some components to it so it can
        alternate between them.
      </Paragraph>
    ),
    help: `Alternative is a designer specific component for
    use with this design tool. It provides a way to alternate through a variety
    of design options.`,
    defaultProps: {
      active: 1,
    },
    properties: {
      active: 1,
    },
  },
  Icon: {
    component: Icon,
    name: 'Icon',
    properties: {
      color: ['-color-'],
      icon: ['-Icon-'],
      size: ['small', 'medium', 'large', 'xlarge'],
    },
  },
  IFrame: {
    component: IFrame,
    name: 'IFrame',
    properties: {
      title: '',
      src: '',
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
    use with this design tool. The key property is 'component'
    which is a reference to the component that should be used.
    Changes to that referenced component will be shown for all
    References to it.`,
    hideable: true,
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
