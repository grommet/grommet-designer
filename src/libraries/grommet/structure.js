import {
  BarChart,
  Bold,
  Capacity,
  CheckboxSelected,
  Image,
  Navigate,
} from 'grommet-icons';

export const structure = [
  {
    name: 'Layout',
    Icon: Capacity,
    components: [
      'Box',
      'Grid',
      'Main',
      'Nav',
      'Header',
      'Footer',
      'Sidebar',
      'Stack',
      'Layer',
    ],
  },
  {
    name: 'Typography',
    Icon: Bold,
    components: ['Heading', 'Paragraph', 'Text', 'Markdown'],
  },
  {
    name: 'Controls',
    Icon: Navigate,
    components: [
      'Accordion',
      'AccordionPanel',
      'Anchor',
      'Button',
      'DropButton',
      'Menu',
      'Tabs',
      'Tab',
    ],
  },
  {
    name: 'Input',
    Icon: CheckboxSelected,
    components: [
      'CheckBox',
      'Form',
      'FormField',
      'RadioButtonGroup',
      'RangeInput',
      'Select',
      'TextArea',
      'TextInput',
    ],
  },
  {
    name: 'Visualizations',
    Icon: BarChart,
    components: [
      'Calendar',
      'Chart',
      'Clock',
      'DataTable',
      'Distribution',
      'List',
      'Meter',
    ],
  },
  {
    name: 'Media',
    Icon: Image,
    components: ['Image', 'Video'],
  },
];
