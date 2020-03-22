import React from 'react';
import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  Button,
  Calendar,
  Chart,
  CheckBox,
  Clock,
  DataTable,
  Distribution,
  DropButton,
  Footer,
  Form,
  FormField,
  Grid,
  Grommet,
  Heading,
  Header,
  Image,
  Layer,
  List,
  Main,
  Markdown,
  MaskedInput,
  Menu,
  Meter,
  Nav,
  Paragraph,
  RadioButtonGroup,
  RangeInput,
  Select,
  Stack,
  Tab,
  Tabs,
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
import BoxPad from './BoxPad';
import BoxRound from './BoxRound';
import ChartBounds from './ChartBounds';
import ChartValues from './ChartValues';
import EdgeSizeOptions from './EdgeSizeOptions';
import GridAreas from './GridAreas';
import GridColumns from './GridColumns';
import GridGap from './GridGap';
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
import WeightOptions from './WeightOptions';
import DropAlign from './DropAlign';
import Edge from './Edge';

const reusedBoxProps = {
  align: BoxAlign,
  background: {
    color: ['-color-'],
    dark: false,
    opacity: ['weak', 'medium', 'strong'],
    position: ['center', 'top', 'bottom', 'left', 'right'],
    image: BoxBackgroundImage,
  },
  border: {
    color: ['-color-'],
    size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    side: ['all', 'horizontal', 'vertical', 'top', 'left', 'bottom', 'right'],
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
  fill: ['horizontal', 'vertical', true, false],
  flex: ['grow', 'shrink', true, false],
  gap: EdgeSizeOptions({
    options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
  }),
  gridArea: BoxGridArea,
  justify: BoxJustify,
  margin: Edge,
  overflow: ['auto', 'hidden', 'scroll', 'visible'],
  pad: BoxPad,
};

const reusedBoxStructure = [
  {
    label: 'Content layout',
    properties: ['direction', 'justify', 'align', 'pad', 'gap', 'overflow'],
  },
  {
    label: 'Layout in container',
    properties: ['flex', 'fill', 'margin', 'gridArea'],
  },
  {
    label: 'Style',
    properties: ['animation', 'background', 'border'],
  },
];

export const components = {
  Box: {
    component: Box,
    name: 'Box',
    container: true,
    hideable: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
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
      ...reusedBoxProps,
      alignSelf: ['stretch', 'start', 'center', 'end'],
      animation: BoxAnimation,
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
      elevation: ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      height: [
        'xxsmall',
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
      ],
      hoverIndicator: false,
      onClick: ['-link-'],
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
      {
        label: 'Interaction',
        properties: ['onClick', 'hoverIndicator'],
      },
    ],
    override: ({ props }, { dataContextPath, followLink }) => {
      return {
        onClick:
          props && props.onClick
            ? event => {
                event.stopPropagation();
                followLink({ ...props.onClick, dataContextPath });
              }
            : undefined,
      };
    },
  },
  Main: {
    component: Main,
    name: 'Main',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Main is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/main',
    defaultProps: {
      fill: 'vertical',
      flex: 'grow',
      overflow: 'auto',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
  },
  Nav: {
    component: Nav,
    name: 'Nav',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Nav is currently empty. Add Buttons to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/nav',
    defaultProps: {
      align: 'center',
      flex: false,
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
  },
  Header: {
    component: Header,
    name: 'Header',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Header is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/header',
    defaultProps: {
      align: 'center',
      direction: 'row',
      flex: false,
      justify: 'between',
      gap: 'medium',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
  },
  Footer: {
    component: Footer,
    name: 'Footer',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Footer is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/header',
    defaultProps: {
      align: 'center',
      direction: 'row',
      flex: false,
      justify: 'between',
      gap: 'medium',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
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
      gap: GridGap,
      justify: ['stretch', 'start', 'center', 'end'],
      justifyContent: ['stretch', 'start', 'center', 'end', 'between'],
      margin: Edge,
      pad: BoxPad,
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
    help: `The Layer can be seen by giving it a name and turning off 'hide',
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
      modal: false,
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
        options: ['small', 'medium', 'large', 'xlarge'],
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
      fill: false,
      size: SizeOptions({
        options: ['small', 'medium', 'large', 'xlarge', 'xxlarge'],
      }),
      textAlign: TextAlign,
      margin: HeadingMargin,
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
      weight: WeightOptions({ options: ['normal', 'bold'] }),
      margin: Edge,
      color: ['-color-'],
    },
  },
  Markdown: {
    component: Markdown,
    name: 'Markdown',
    text: 'Markdown',
  },
  Accordion: {
    component: Accordion,
    name: 'Accordion',
    container: true,
    documentation: 'https://v2.grommet.io/accordion',
    properties: {
      animate: true,
      multiple: false,
    },
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Accordion is currently empty. Add AccordionPanels to it.
      </Paragraph>
    ),
  },
  AccordionPanel: {
    component: AccordionPanel,
    name: 'AccordionPanel',
    container: true,
    documentation: 'https://v2.grommet.io/accordion',
    defaultProps: {
      label: 'panel',
    },
    properties: {
      label: 'panel',
    },
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
      size: ['small', 'medium', 'large'],
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
  Tabs: {
    component: Tabs,
    name: 'Tabs',
    container: true,
    documentation: 'https://v2.grommet.io/tabs',
    properties: {
      activeIndex: 0,
      flex: ['grow', 'shrink', true, false],
      margin: Edge,
    },
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Tabs is currently empty. Add Tab components to it.
      </Paragraph>
    ),
  },
  Tab: {
    component: Tab,
    name: 'Tab',
    container: true,
    documentation: 'https://v2.grommet.io/tabs',
    defaultProps: {
      title: 'tab',
    },
    properties: {
      title: 'tab',
      plain: false,
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
      disabled: false,
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
      disabled: false,
      mask: MaskedInputMask,
      plain: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      value: '',
    },
  },
  RadioButtonGroup: {
    component: RadioButtonGroup,
    name: 'RadioButtonGroup',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      disabled: false,
      options: SelectOptions,
      value: '',
    },
  },
  RangeInput: {
    component: RangeInput,
    name: 'RangeInput',
    defaultProps: {
      max: 10,
      min: 0,
      step: 1,
      value: 0,
    },
    properties: {
      max: 10,
      min: 0,
      step: 1,
      value: 0,
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
      disabled: false,
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
      disabled: false,
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
      values: [
        { value: [0, 10] },
        { value: [1, 20] },
        { value: [2, 25] },
        { value: [3, 40] },
        { value: [4, 35] },
      ],
    },
    properties: {
      bounds: ChartBounds,
      color: {
        color: ['-color-'],
        opacity: ['weak', 'medium', 'strong'],
      },
      dash: false,
      gap: EdgeSizeOptions({
        options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
        direction: 'row',
      }),
      margin: Edge,
      overflow: false,
      round: false,
      size: {
        height: [
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
          'full',
        ],
        width: [
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
          'full',
        ],
      },
      thickness: ['hair', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      type: ['bar', 'line', 'area', 'point'],
      values: ChartValues,
    },
    designProperties: {
      dataPath: '',
    },
    override: (_, { data }) => {
      const result = {};
      // need to use retrieved data for values property
      if (data) result.values = data;
      return result;
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
      pad: BoxPad,
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
  Distribution: {
    component: Distribution,
    name: 'Distribution',
    defaultProps: {
      gap: 'xsmall',
      values: [
        { value: 10 },
        { value: 20 },
        { value: 25 },
        { value: 40 },
        { value: 35 },
      ],
    },
    properties: {
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
      fill: false,
      gap: EdgeSizeOptions({
        options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
        direction: 'row',
      }),
      margin: Edge,
      values: MeterValues,
    },
    designProperties: {
      dataPath: '',
    },
    override: ({ props }, { data }) => {
      const result = {};
      // need to use retrieved data for values property
      if (data) result.values = data;
      result.children = value => (
        <Box fill background={value.color} pad="xsmall">
          <Text>{value.value}</Text>
        </Box>
      );
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
      pad: BoxPad,
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
      max: 100,
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
      fill: ['horizontal', 'vertical', true, false],
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
