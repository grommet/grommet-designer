import React from 'react';
import {
  Anchor,
  Box,
  Button,
  Calendar,
  Chart,
  CheckBox,
  Clock,
  DataTable,
  DropButton,
  Form,
  FormField,
  Grid,
  Grommet,
  Heading,
  Image,
  Layer,
  List,
  Markdown,
  MaskedInput,
  Menu,
  Meter,
  Paragraph,
  Select,
  Stack,
  Text,
  TextArea,
  TextInput,
  Video,
} from 'grommet';
import BoxAlign from './BoxAlign';
import BoxAnimation from './BoxAnimation';
import BoxBackgroundImage from './BoxBackgroundImage';
import BoxDirection from './BoxDirection';
import BoxGridArea from './BoxGridArea';
import BoxJustify from './BoxJustify';
import BoxRound from './BoxRound';
import ChartBounds from './ChartBounds';
import ChartValues from './ChartValues';
import EdgeSizeOptions from './EdgeSizeOptions';
import GridAreas from './GridAreas';
import GridColumns from './GridColumns';
import GridRows from './GridRows';
import DataTableColumns from './DataTableColumns';
import DataTableData from './DataTableData';
import HeadingLevel from './HeadingLevel';
import HeadingMargin from './HeadingMargin';
import ImageSrc from './ImageSrc';
import MaskedInputMask from './MaskedInputMask';
import MenuItems from './MenuItems';
import MeterValues from './MeterValues';
import SelectOptions from './SelectOptions';
import SizeOptions from './SizeOptions';
import TextAlign from './TextAlign';
import TextAreaValue from './TextAreaValue';
import TextInputSuggestions from './TextInputSuggestions';
import DropAlign from './DropAlign';
import Edge from './Edge';

export const components = {
  Box: {
    component: Box,
    name: 'Box',
    container: true,
    placeholder: ({ pad }) =>
      !pad && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Box is currently empty. Add components to it, so it can do its
          layout thing.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/box',
    defaultProps: {
      align: 'center',
      justify: 'center',
    },
    properties: {
      align: BoxAlign,
      alignSelf: ['stretch', 'start', 'center', 'end'],
      animation: BoxAnimation,
      background: {
        color: ['-color-'],
        dark: false,
        opacity: ['weak', 'medium', 'strong'],
        position: ['center', 'top', 'bottom', 'left', 'right'],
        image: BoxBackgroundImage,
      },
      basis: [
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
        'full',
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '3/4',
        'auto',
      ],
      border: {
        color: ['-color-'],
        size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
        side: [
          'all',
          'horizontal',
          'vertical',
          'top',
          'left',
          'bottom',
          'right',
        ],
        style: [
          'solid',
          'dashed',
          'dotted',
          'double',
          'groove',
          'ridge',
          'inset',
          'outset',
          'hidden',
        ],
      },
      direction: BoxDirection,
      elevation: ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      fill: ['horizontal', 'vertical', true, false],
      flex: ['grow', 'shrink', true, false],
      gap: EdgeSizeOptions({
        options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      }),
      gridArea: BoxGridArea,
      height: [
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
      ],
      justify: BoxJustify,
      margin: Edge,
      overflow: ['auto', 'hidden', 'scroll', 'visible'],
      pad: Edge,
      round: BoxRound,
      width: [
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
      ],
      wrap: false,
    },
    structure: [
      {
        label: 'Content layout',
        properties: [
          'direction',
          'justify',
          'align',
          'pad',
          'gap',
          'overflow',
          'wrap',
        ],
      },
      {
        label: 'Layout in container',
        properties: [
          'flex',
          'fill',
          'margin',
          'height',
          'width',
          'basis',
          'alignSelf',
          'gridArea',
        ],
      },
      {
        label: 'Style',
        properties: ['animation', 'background', 'border', 'elevation', 'round'],
      },
    ],
  },
  Grid: {
    component: Grid,
    name: 'Grid',
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Grid is currently empty. Define columns and add components to it.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/grid',
    properties: {
      align: ['stretch', 'start', 'center', 'end'],
      alignContent: ['stretch', 'start', 'center', 'end'],
      areas: GridAreas,
      columns: GridColumns,
      fill: ['horizontal', 'vertical'],
      gap: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      justify: ['stretch', 'start', 'center', 'end'],
      justifyContent: ['stretch', 'start', 'center', 'end', 'between'],
      margin: Edge,
      rows: GridRows,
    },
  },
  Stack: {
    component: Stack,
    name: 'Stack',
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Stack is currently empty. Add some components to it so they can be
        stacked.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/stack',
    properties: {
      anchor: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      fill: false,
      guidingChild: ['first', 'last'],
      margin: Edge,
    },
  },
  Layer: {
    component: Layer,
    name: 'Layer',
    container: true,
    hideable: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Layer is currently empty. Add components to it, so it can show
        something.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/layer',
    help: `The Layer can be seen by setting 'hide' to 'true',
    allowing you to populate its contents. Wire up a Layer so it can be
    dynamically shown via a Button link, List onClickItem,
    or DataTable onClickRow.
    `,
    defaultProps: {
      animate: true,
      modal: false,
    },
    properties: {
      animate: false,
      full: ['horizontal', 'vertical'],
      margin: ['none', 'xsmall', 'small', 'medium', 'large'],
      plain: false,
      position: ['center', 'top', 'bottom', 'left', 'right'],
      responsive: false,
    },
    override: (_, { setHide }) => {
      const result = {};
      result.onClickOutside = () => setHide(true);
      result.onEsc = () => setHide(true);
      return result;
    },
  },
  Grommet: { component: Grommet, name: 'Grommet', container: true },
  Heading: {
    component: Heading,
    name: 'Heading',
    text: 'Heading',
    documentation: 'https://v2.grommet.io/heading',
    properties: {
      level: HeadingLevel,
      size: SizeOptions({
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      }),
      textAlign: TextAlign,
      truncate: false,
      margin: HeadingMargin,
      color: ['-color-'],
    },
  },
  Paragraph: {
    component: Paragraph,
    name: 'Paragraph',
    text: 'Paragraph',
    properties: {
      size: SizeOptions({
        options: ['small', 'medium', 'large', 'xlarge', 'xxlarge'],
      }),
      textAlign: TextAlign,
      margin: Edge,
      color: ['-color-'],
    },
  },
  Text: {
    component: Text,
    name: 'Text',
    text: 'Text',
    properties: {
      size: SizeOptions({
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
      }),
      textAlign: TextAlign,
      truncate: false,
      weight: ['normal', 'bold'],
      margin: Edge,
      color: ['-color-'],
    },
  },
  Markdown: {
    component: Markdown,
    name: 'Markdown',
    text: 'Markdown',
  },
  Anchor: {
    component: Anchor,
    name: 'Anchor',
    container: true,
    defaultProps: {
      label: 'anchor',
    },
    properties: {
      label: 'anchor',
      color: ['-color-'],
      href: '',
      margin: Edge,
      size: ['xsmall', 'small', 'medium', 'large'],
    },
    designProperties: {
      link: ['-link-'],
    },
    override: ({ designProps }, { dataContextPath, followLink }) => {
      return {
        onClick:
          designProps && designProps.link
            ? event => {
                event.stopPropagation();
                followLink({ ...designProps.link, dataContextPath });
              }
            : undefined,
      };
    },
  },
  Button: {
    component: Button,
    name: 'Button',
    container: true,
    defaultProps: {
      label: 'Button',
    },
    properties: {
      label: 'Click Me',
      icon: ['-Icon-'],
      active: false,
      color: ['-color-'],
      disabled: false,
      fill: ['horizontal', 'vertical'],
      gap: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      hoverIndicator: false,
      href: '',
      margin: Edge,
      plain: false,
      primary: false,
      reverse: false,
      type: ['button', 'reset', 'submit'],
    },
    designProperties: {
      link: ['-link-'],
    },
    override: ({ designProps }, { dataContextPath, followLink }) => {
      return {
        onClick:
          designProps && designProps.link
            ? event => {
                event.stopPropagation();
                followLink({ ...designProps.link, dataContextPath });
              }
            : undefined,
      };
    },
  },
  DropButton: {
    component: DropButton,
    name: 'DropButton',
    container: true,
    help: `The dropContent of DropButton can be seen by setting the 'open'
    property to 'true', allowing you to populate the contents. You can then
    restore 'open' to 'undefined', so the button is interactive again.`,
    documentation: 'https://v2.grommet.io/dropbutton',
    defaultProps: {
      label: 'Drop Button',
      dropAlign: { top: 'bottom' },
      open: true,
    },
    properties: {
      color: ['-color-'],
      disabled: false,
      dropAlign: DropAlign,
      dropContent: '-component- grommet.Box',
      dropProps: {
        elevation: ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
        plain: false,
        stretch: true,
      },
      fill: ['horizontal', 'vertical'],
      gap: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      hoverIndicator: false,
      href: '',
      icon: ['-Icon-'],
      label: 'Click Me',
      margin: Edge,
      open: [true, false],
      plain: false,
      primary: false,
      reverse: false,
    },
  },
  Menu: {
    component: Menu,
    name: 'Menu',
    defaultProps: {
      label: 'Menu',
    },
    properties: {
      disabled: false,
      dropAlign: DropAlign,
      dropBackground: {
        color: ['-color-'],
        opacity: ['weak', 'medium', 'strong'],
      },
      icon: ['-Icon-'],
      items: MenuItems,
      label: 'Actions',
      open: false,
      size: ['small', 'medium', 'large', 'xlarge'],
    },
    override: ({ props }, { followLink }) => {
      const result = {};
      result.items = (props.items || []).map(item => ({
        ...item,
        onClick: event => {
          event.stopPropagation();
          followLink(item.link);
        },
      }));
      return result;
    },
  },
  CheckBox: {
    component: CheckBox,
    name: 'CheckBox',
    defaultProps: {
      label: 'CheckBox',
    },
    properties: {
      checked: false,
      disabled: false,
      label: 'enabled?',
      reverse: false,
      toggle: false,
    },
  },
  Form: {
    component: Form,
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Form is currently empty. Add some FormField components to it so it
        can group them.
      </Paragraph>
    ),
    name: 'Form',
  },
  FormField: {
    component: FormField,
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This FormField is currently empty. Add an input component to it so it
        can decorate it.
      </Paragraph>
    ),
    name: 'FormField',
    defaultProps: {
      label: 'FormField',
    },
    properties: {
      color: ['-color-'],
      error: 'error',
      help: 'help',
      label: 'label',
      name: 'string',
    },
  },
  MaskedInput: {
    component: MaskedInput,
    name: 'MaskedInput',
    properties: {
      mask: MaskedInputMask,
      plain: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      value: '',
    },
  },
  Select: {
    component: Select,
    name: 'Select',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      closeOnChange: true,
      disabled: false,
      dropAlign: DropAlign,
      dropHeight: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      icon: ['-Icon-'],
      multiple: false,
      options: SelectOptions,
      placeholder: '',
      plain: false,
      searchPlaceholder: '',
      size: ['small', 'medium', 'large', 'xlarge'],
      value: '',
    },
  },
  TextArea: {
    component: TextArea,
    name: 'TextArea',
    properties: {
      fill: false,
      placeholder: '',
      plain: false,
      resize: ['vertical', 'horizontal', true, false],
      size: ['small', 'medium', 'large', 'xlarge'],
      value: TextAreaValue,
    },
  },
  TextInput: {
    component: TextInput,
    name: 'TextInput',
    properties: {
      placeholder: '',
      plain: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      suggestions: TextInputSuggestions,
      type: ['text', 'password'],
      value: '',
    },
  },
  Calendar: {
    component: Calendar,
    name: 'Calendar',
    properties: {
      animate: false,
      daysOfWeek: false,
      range: false,
      size: ['small', 'medium', 'large'],
    },
  },
  Chart: {
    component: Chart,
    name: 'Chart',
    defaultProps: {
      type: 'bar',
    },
    properties: {
      bounds: ChartBounds,
      color: ['-color-'],
      margin: Edge,
      overflow: false,
      round: false,
      size: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      thickness: ['hair', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      type: ['bar', 'line', 'area'],
      values: ChartValues,
    },
  },
  Clock: {
    component: Clock,
    name: 'Clock',
    properties: {
      hourLimit: ['12', '24'],
      precision: ['hours', 'minutes', 'seconds'],
      run: ['forward', 'backward'],
      size: ['small', 'medium', 'large', 'xlarge'],
      type: ['analog', 'digital'],
    },
  },
  DataTable: {
    component: DataTable,
    name: 'DataTable',
    defaultProps: {
      columns: [
        { header: 'Name', property: 'name', primary: true },
        { header: 'Count', property: 'count' },
      ],
      data: [
        { name: 'Eric', count: 5 },
        { name: 'Shimi', count: 7 },
      ],
    },
    properties: {
      columns: DataTableColumns,
      data: DataTableData,
      groupBy: '',
      onClickRow: ['-link-'],
      replace: false,
      resizeable: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      sortable: false,
    },
    designProperties: {
      dataPath: '',
    },
    override: ({ props }, { data, dataContextPath, followLink }) => {
      const result = {};
      // need to use retrieved data for data property
      if (data) result.data = data;
      if (props.onClickRow) {
        result.onClickRow = event => {
          event.stopPropagation();
          const { index } = event;
          const path = dataContextPath ? [...dataContextPath, index] : [index];
          followLink({ ...props.onClickRow, dataContextPath: path });
        };
      }
      return result;
    },
  },
  List: {
    component: List,
    name: 'List',
    defaultProps: {
      data: [
        { name: 'Eric', count: 5 },
        { name: 'Shimi', count: 7 },
      ],
    },
    properties: {
      data: DataTableData,
      onClickItem: ['-link-'],
      primaryKey: '',
      secondaryKey: '',
    },
    designProperties: {
      dataPath: '',
    },
    override: ({ props }, { data, dataContextPath, followLink }) => {
      const result = {};
      // need to use retrieved data for data property
      if (data) result.data = data;
      if (props.onClickItem) {
        result.onClickItem = event => {
          event.stopPropagation();
          const { index } = event;
          const path = dataContextPath ? [...dataContextPath, index] : [index];
          followLink({ ...props.onClickItem, dataContextPath: path });
        };
      }
      return result;
    },
  },
  Meter: {
    component: Meter,
    name: 'Meter',
    properties: {
      background: ['-color-'],
      round: false,
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'full'],
      thickness: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      type: ['bar', 'circle'],
      values: MeterValues,
    },
  },
  Image: {
    component: Image,
    name: 'Image',
    defaultProps: {
      src:
        'https://photos.smugmug.com/Pinnacles-May-2019/n-8KLNDR/i-bxkrqwL/0/1c7fa7f2/M/i-bxkrqwL-M.jpg',
    },
    properties: {
      fit: ['cover', 'contain'],
      opacity: ['weak', 'medium', 'strong'],
      src: ImageSrc,
    },
    override: ({ props }, { replaceData }) => {
      return { src: replaceData(props.src) };
    },
  },
  Video: {
    component: Video,
    name: 'Video',
    properties: {
      autoPlay: false,
      controls: [false, 'over', 'below'],
      fit: ['cover', 'contain'],
      loop: false,
    },
    designProperties: {
      source: '',
    },
    override: ({ designProps }, { replaceData }) => {
      if (designProps && designProps.source) {
        const source = replaceData(designProps.source);
        return { children: <source src={source} /> };
      }
      return null;
    },
  },
};
