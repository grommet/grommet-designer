import React from 'react';
import {
  Anchor, Box, Button, FormField, Grid, Grommet, Heading, Layer,
  Menu, Meter, Paragraph,
  Select, Stack, Text, TextArea, TextInput, base, grommet,
} from 'grommet';

const colors = Object.keys({ ...base.global.colors, ...grommet.global.colors });

export const componentTypes = {
  Box: {
    component: Box,
    name: 'Box',
    sample: <Box pad="xsmall" border>Box</Box>,
    properties: {
      align: ['stretch', 'start', 'center', 'end'],
      background: colors,
      direction: ['column', 'row'],
      fill: ['horizontal', 'vertical'],
      gap: ['xsmall', 'small', 'medium', 'large'],
      justify: ['between', 'start', 'center', 'end'],
      round: ['xsmall', 'small', 'medium', 'large', 'full'],
      pad: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
  Grid: {
    component: Grid,
    name: 'Grid',
    sample: <Box pad="xsmall" border={{ side: 'vertical', size: 'xlarge' }}>Grid</Box>,
  },
  Stack: {
    component: Stack,
    name: 'Stack',
    sample: (
      <Stack guidingChild="last">
        <Box width="xxsmall" background={{ color: 'brand', opacity: 'medium' }} fill="vertical" round="full"/>
        <Box pad="xsmall" border>Stack</Box>
      </Stack>
    ),
  },
  Layer: {
    component: Layer,
    name: 'Layer',
    sample: <Box pad="xsmall" border={{ side: 'right', size: 'xlarge' }}>Layer</Box>,
  },
  Grommet: { component: Grommet, name: 'Grommet' },
  Heading: {
    component: Heading,
    name: 'Heading',
    sample: <Heading size="small" margin="none">Heading</Heading>,
    text: true,
    properties: {
      level: ['1', '2', '3', '4'],
      margin: ['none', 'small', 'medium', 'large'],
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
  Paragraph: {
    component: Paragraph,
    name: 'Paragraph',
    text: true,
    properties: {
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
  Text: {
    component: Text,
    name: 'Text',
    text: true,
    properties: {
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
  Anchor: {
    component: Anchor,
    name: 'Anchor',
    sample: <Text style={{ textDecoration: 'underline' }}>Anchor</Text>,
    properties: {
      color: colors,
      label: 'anchor',
      size: ['xsmall', 'small', 'medium', 'large'],
    },
  },
  Button: {
    component: Button,
    name: 'Button',
    sample: (
      <Box
        round="medium"
        border={{ color: 'brand', size: 'medium' }}
        align="center"
      >
        Button
      </Box>
    ),
    properties: {
      color: colors,
      label: 'Click Me',
    },
  },
  Menu: {
    component: Menu,
    name: 'Menu',
  },
  FormField: {
    component: FormField,
    name: 'FormField',
    properties: {
      color: colors,
      error: 'error',
      help: 'help',
      label: 'label',
    },
  },
  Select: {
    component: Select,
    name: 'Select',
  },
  TextArea: {
    component: TextArea,
    name: 'TextArea',
  },
  TextInput: {
    component: TextInput,
    name: 'TextInput',
    properties: {
      placeholder: '',
    }
  },
  Meter: {
    component: Meter,
    name: 'Meter',
  },
};

export const Adder = ({ onAdd, onClose }) => (
  <Layer
    position="top-left"
    margin="medium"
    onEsc={onClose}
    onClickOutside={onClose}
  >
    <Grid columns="small" rows="xxsmall">
      {Object.keys(componentTypes).filter(key => key !== 'Grommet').map((key) => {
        const componentType = componentTypes[key];
        return (
          <Box fill key={key} round="small" overflow="hidden">
            <Button fill hoverIndicator onClick={() => onAdd(key)}>
              <Box pad={{ horizontal: 'small', vertical: 'xxsmall' }}>
                {componentType.sample || componentType.name}
              </Box>
            </Button>
          </Box>
        );
      })}
    </Grid>
  </Layer>
);
