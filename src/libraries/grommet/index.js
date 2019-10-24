import {
  BarChart,
  Bold,
  Capacity,
  CheckboxSelected,
  Image,
  Navigate,
} from 'grommet-icons';
import { components } from './components';

const structure = [
  {
    name: 'Layout',
    Icon: Capacity,
    components: ['Box', 'Grid', 'Stack', 'Layer'],
  },
  {
    name: 'Typography',
    Icon: Bold,
    components: ['Heading', 'Paragraph', 'Text', 'Markdown'],
  },
  {
    name: 'Controls',
    Icon: Navigate,
    components: ['Anchor', 'Button', 'DropButton', 'Menu'],
  },
  {
    name: 'Input',
    Icon: CheckboxSelected,
    components: [
      'CheckBox',
      'Form',
      'FormField',
      'Select',
      'TextArea',
      'TextInput',
    ],
  },
  {
    name: 'Visualizations',
    Icon: BarChart,
    components: ['Calendar', 'Clock', 'DataTable', 'Meter'],
  },
  {
    name: 'Media',
    Icon: Image,
    components: ['Image', 'Video'],
  },
];

export default {
  name: 'grommet',
  components,
  structure,
};
