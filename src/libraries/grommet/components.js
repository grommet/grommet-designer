import React from 'react';
import {
  Accordion,
  AccordionPanel,
  Anchor,
  Avatar,
  Box,
  Button,
  Calendar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Carousel,
  Chart,
  CheckBox,
  CheckBoxGroup,
  Clock,
  DataChart,
  DataTable,
  DateInput,
  Diagram,
  Distribution,
  DropButton,
  FileInput,
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
  NameValueList,
  NameValuePair,
  Pagination,
  Paragraph,
  RadioButtonGroup,
  RangeInput,
  Select,
  Sidebar,
  Spinner,
  Stack,
  Tab,
  Tabs,
  Tag,
  Text,
  TextArea,
  TextInput,
  Video,
  WorldMap,
} from 'grommet';
import BoxAlign from './BoxAlign';
import BoxAnimation from './BoxAnimation';
import BoxBackgroundImage from './BoxBackgroundImage';
import BoxDirection from './BoxDirection';
import BoxGridArea from './BoxGridArea';
import BoxHoverIndicator from './BoxHoverIndicator';
import BoxJustify from './BoxJustify';
import BoxPad from './BoxPad';
import BoxRound from './BoxRound';
import ChartBounds from './ChartBounds';
import ChartValues from './ChartValues';
import DataChartChart from './DataChartChart';
import DataChartSeries from './DataChartSeries';
import DataTableColumns from './DataTableColumns';
import DataTablePrimaryKey from './DataTablePrimaryKey';
import DiagramConnections from './DiagramConnections';
import Dimension from './Dimension';
import EdgeSizeOptions from './EdgeSizeOptions';
import GridAreas from './GridAreas';
import GridColumns from './GridColumns';
import GridGap from './GridGap';
import GridRows from './GridRows';
import HeadingLevel from './HeadingLevel';
import HeadingMargin from './HeadingMargin';
import ImageSrc from './ImageSrc';
import JsonData from './JsonData';
import MaskedInputMask from './MaskedInputMask';
import MenuItems from './MenuItems';
import MeterValues from './MeterValues';
import SelectOptions from './SelectOptions';
import SizeOptions from './SizeOptions';
import TextAlign from './TextAlign';
import TextAreaValue from './TextAreaValue';
import TextInputSuggestions from './TextInputSuggestions';
import WeightOptions from './WeightOptions';
import WorldMapPlaces from './WorldMapPlaces';
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
    side: [
      'all',
      'horizontal',
      'vertical',
      'top',
      'left',
      'bottom',
      'right',
      'between',
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
  fill: ['horizontal', 'vertical', true, false],
  flex: ['grow', 'shrink', true, false],
  gap: ['none', 'xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
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
    respondable: true,
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
      height: Dimension,
      hoverIndicator: BoxHoverIndicator,
      onClick: ['-link-'],
      responsive: true,
      round: BoxRound,
      width: Dimension,
      wrap: false,
    },
    advancedProperties: ['alignSelf', 'height', 'responsive', 'width', 'wrap'],
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
          'responsive',
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
            ? (event) => {
                event.stopPropagation();
                followLink(props.onClick, { dataContextPath });
              }
            : undefined,
      };
    },
  },
  Main: {
    component: Main,
    name: 'Main',
    container: true,
    hideable: true,
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
    hideable: true,
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
    hideable: true,
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
    hideable: true,
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
  Sidebar: {
    component: Sidebar,
    name: 'Sidebar',
    container: true,
    hideable: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Sidebar is currently empty. Add a Nav component to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/sidebar',
    defaultProps: {
      align: 'stretch',
      direction: 'column',
      flex: false,
      gap: 'large',
      pad: 'small',
    },
    properties: {
      ...reusedBoxProps,
      header: '-component- grommet.Box {"align":"stretch","justify":"stretch"}',
      footer: '-component- grommet.Box {"align":"stretch","justify":"stretch"}',
    },
    structure: [
      {
        label: 'Content',
        properties: ['header', 'footer'],
      },
      ...reusedBoxStructure,
    ],
  },
  Grid: {
    component: Grid,
    name: 'Grid',
    container: true,
    hideable: true,
    respondable: true,
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
      height: Dimension,
      justify: ['stretch', 'start', 'center', 'end'],
      justifyContent: ['stretch', 'start', 'center', 'end', 'between'],
      margin: Edge,
      pad: BoxPad,
      rows: GridRows,
      width: Dimension,
    },
    advancedProperties: [
      'align',
      'alignContent',
      'justify',
      'justifyContent',
      'margin',
    ],
  },
  Card: {
    component: Card,
    name: 'Card',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This Card is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/card',
    properties: {
      ...reusedBoxProps,
      height: Dimension,
      hoverIndicator: BoxHoverIndicator,
      onClick: ['-link-'],
      width: Dimension,
    },
    structure: [
      reusedBoxStructure[0],
      {
        label: 'Layout in container',
        properties: ['flex', 'fill', 'margin', 'gridArea', 'width', 'height'],
      },
      reusedBoxStructure[2],
      {
        label: 'Interaction',
        properties: ['onClick', 'hoverIndicator'],
      },
    ],
    override: ({ props }, { dataContextPath, followLink }) => {
      return {
        onClick:
          props && props.onClick
            ? (event) => {
                event.stopPropagation();
                followLink(props.onClick, { dataContextPath });
              }
            : undefined,
      };
    },
  },
  CardHeader: {
    component: CardHeader,
    name: 'CardHeader',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This CardHeader is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/card',
    defaultProps: {
      align: 'center',
      direction: 'row',
      flex: false,
      justify: 'between',
      gap: 'medium',
      pad: 'small',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
  },
  CardBody: {
    component: CardBody,
    name: 'CardBody',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This CardBody is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/card',
    defaultProps: {
      pad: 'small',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
  },
  CardFooter: {
    component: CardFooter,
    name: 'CardFooter',
    container: true,
    placeholder: ({ background, pad }) =>
      !pad &&
      !background && (
        <Paragraph size="large" textAlign="center" color="placeholder">
          This CardFooter is currently empty. Add components to it.
        </Paragraph>
      ),
    documentation: 'https://v2.grommet.io/card',
    defaultProps: {
      align: 'center',
      direction: 'row',
      flex: false,
      justify: 'between',
      gap: 'medium',
      pad: 'small',
    },
    properties: reusedBoxProps,
    structure: reusedBoxStructure,
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
    advancedProperties: ['margin'],
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
      full: ['horizontal', 'vertical', true],
      margin: ['none', 'xsmall', 'small', 'medium', 'large'],
      modal: false,
      onClickOutside: ['hide', 'ignore'],
      plain: false,
      position: ['center', 'top', 'bottom', 'left', 'right'],
      responsive: false,
    },
    advancedProperties: ['animate', 'responsive'],
    override: ({ props }, { setHide }) => {
      const result = {};
      if (props.modal !== false && props.onClickOutside !== 'ignore') {
        result.onClickOutside = (event) => {
          let node = event.target;
          // only hide if clicking the modal overlay, which is outside root
          while (node && node.id !== 'root') node = node.parentNode;
          if (!node) setHide(true);
        };
      } else if (props.modal === false && props.onClickOutside === 'hide') {
        result.onClickOutside = (event) => {
          let node = event.target;
          // only hide if clicking within the Canvas
          while (node && node.id !== 'designer-canvas') node = node.parentNode;
          if (node) setHide(true);
        };
      } else result.onClickOutside = undefined;
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
      size: [
        'xsmall',
        'small',
        'medium',
        'large',
        'xlarge',
        'xxlarge',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
      ],
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
    properties: {
      components: {
        p: {
          props: {
            fill: false,
            size: ['small', 'medium', 'large'],
            textAlign: ['start', 'center', 'end'],
          },
        },
      },
    },
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
    container: 'rarely',
    defaultProps: {
      label: 'anchor',
    },
    properties: {
      label: 'anchor',
      color: ['-color-'],
      disabled: false,
      href: '',
      margin: Edge,
      size: ['xsmall', 'small', 'medium', 'large'],
    },
    designProperties: {
      link: ['-link-'],
    },
    advancedProperties: ['margin', 'color'],
    override: (
      { designProps, props },
      { dataContextPath, followLink, replaceData },
    ) => {
      return {
        label: replaceData(props.label),
        onClick:
          designProps && designProps.link
            ? (event) => {
                event.stopPropagation();
                followLink(designProps.link, { dataContextPath });
              }
            : undefined,
      };
    },
  },
  Button: {
    component: Button,
    name: 'Button',
    container: 'rarely',
    defaultProps: {
      label: 'Button',
    },
    properties: {
      label: 'Click Me',
      icon: ['-Icon-'],
      active: false,
      badge: 0,
      color: ['-color-'],
      disabled: false,
      fill: ['horizontal', 'vertical'],
      gap: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      hoverIndicator: BoxHoverIndicator,
      href: '',
      kind: ['-theme-'],
      margin: Edge,
      plain: [true, false],
      primary: false,
      reverse: false,
      secondary: false,
      size: ['small', 'medium', 'large'],
      tip: '',
      type: ['button', 'reset', 'submit'],
    },
    designProperties: {
      link: ['-link-'],
    },
    advancedProperties: ['color', 'fill', 'gap', 'margin', 'size'],
    override: ({ designProps, props }, { dataContextPath, followLink }) => {
      return {
        badge: props.badge === 0 ? true : props.badge,
        onClick:
          designProps && designProps.link
            ? (event) => {
                event.stopPropagation();
                followLink(designProps.link, { dataContextPath });
              }
            : undefined,
      };
    },
  },
  DropButton: {
    component: DropButton,
    name: 'DropButton',
    container: 'rarely',
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
      badge: 0,
      color: ['-color-'],
      disabled: false,
      dropAlign: DropAlign,
      dropContent: '-component- grommet.Box {"pad":"medium"}',
      dropProps: {
        elevation: ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
        plain: false,
        stretch: true,
      },
      fill: ['horizontal', 'vertical'],
      gap: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      hoverIndicator: BoxHoverIndicator,
      href: '',
      icon: ['-Icon-'],
      kind: ['-theme-'],
      label: 'Click Me',
      margin: Edge,
      open: [true, false],
      plain: false,
      primary: false,
      reverse: false,
      secondary: false,
      size: ['small', 'medium', 'large'],
      tip: '',
    },
    advancedProperties: ['color', 'disabled', 'gap', 'margin'],
    override: ({ props }) => {
      const result = {};
      if (props.badge !== undefined)
        result.badge = props.badge === 0 ? true : props.badge;
      return result;
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
      kind: ['-theme-'],
      label: 'Actions',
      open: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      tip: '',
    },
    override: ({ props }, { followLink }) => {
      const result = {};
      result.items = (props.items || []).map((item) => ({
        ...item,
        onClick: (event) => {
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
    defaultProps: {
      justify: 'center',
    },
    properties: {
      activeIndex: 0,
      flex: ['grow', 'shrink', true, false],
      justify: ['start', 'center', 'end'],
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
      disabled: false,
      icon: ['-Icon-'],
      title: 'tab',
      plain: false,
      reverse: false,
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
      defaultChecked: false,
      disabled: false,
      label: 'enabled?',
      name: '',
      reverse: false,
      toggle: false,
    },
    designProperties: {
      dataPath: '',
      link: ['-link-checked-'],
    },
    override: (
      { designProps, props },
      { data, dataContextPath, followLinkOption, replaceData },
    ) => {
      const result = {
        onChange: designProps?.link
          ? (event) => {
              followLinkOption(designProps.link, event.target.checked, {
                dataContextPath,
              });
            }
          : undefined,
      };
      if (props.label) {
        result.label = replaceData(props.label);
      }
      if (designProps?.dataPath) {
        result.checked =
          typeof data === 'object' ? data[designProps.dataPath] : data;
      }
      return result;
    },
    initialize: ({ props, designProps }, { followLinkOption }) => {
      if (designProps?.link) {
        followLinkOption(
          designProps.link,
          props.checked !== undefined ? props.checked : props.defaultChecked,
        );
      }
    },
  },
  CheckBoxGroup: {
    component: CheckBoxGroup,
    name: 'CheckBoxGroup',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      direction: BoxDirection,
      disabled: false,
      gap: EdgeSizeOptions({
        options: [
          'none',
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
        ],
      }),
      name: '',
      options: SelectOptions,
      value: ['-property- options'],
    },
    advancedProperties: ['gap'],
    designProperties: {
      link: ['-link-options-'],
    },
    override: (
      { id, props, designProps },
      { dataContextPath, followLinkOption },
    ) => {
      const result = {};
      if (!props.id) result.id = props.name || id;
      if (!props.value) result.value = undefined;
      if (designProps && designProps.link) {
        result.onChange = ({ value }) =>
          followLinkOption(designProps.link, value, { dataContextPath });
      }
      return result;
    },
    initialize: ({ props, designProps }, { followLinkOption }) => {
      if (designProps && designProps.link) {
        followLinkOption(designProps.link, props.value);
      }
    },
  },
  DateInput: {
    component: DateInput,
    name: 'DateInput',
    defaultProps: {
      format: 'mm/dd/yyyy',
    },
    properties: {
      defaultValue: '',
      disabled: false,
      name: '',
      inline: false,
      format: '',
      value: '',
    },
  },
  FileInput: {
    component: FileInput,
    name: 'FileInput',
    properties: {
      disabled: false,
      id: '',
      multiple: false,
      name: '',
      renderFile: '-component- grommet.Box {"pad":"small"}',
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
    designProperties: {
      dataPath: '',
    },
    // action to auto-build FormFields based on dataPath
    actions: (
      { designProps, id },
      { addChildComponent, changeDesign, data, design },
    ) => {
      if (
        designProps?.dataPath &&
        typeof data?.[designProps.dataPath] === 'object'
      ) {
        return (
          <Box direction="row" justify="end" pad="small">
            <Button
              label="generate fields"
              onClick={() => {
                // add FormField and TextInput children for all keys in the data
                const nextDesign = JSON.parse(JSON.stringify(design));
                const nextForm = nextDesign.components[id];
                Object.keys(data[designProps.dataPath]).forEach((key) => {
                  // see if we already have a FormField with this name
                  if (
                    !nextForm.children ||
                    !nextForm.children.some(
                      (childId) =>
                        nextDesign.components[childId].props?.name === key,
                    )
                  ) {
                    const fieldId = addChildComponent(nextDesign, id, {
                      type: 'grommet.FormField',
                      props: { label: key, name: key },
                    });
                    addChildComponent(nextDesign, fieldId, {
                      type: 'grommet.TextInput',
                      props: { name: key },
                    });
                  }
                });
                changeDesign(nextDesign);
              }}
            />
          </Box>
        );
      }
    },
    override: ({ designProps }, { data, setData }) => {
      const result = {};
      if (designProps?.dataPath) {
        result.value = data || {};
        result.onChange = setData;
        result.onReset = () => setData(undefined);
      }
      return result;
    },
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
      required: false,
    },
  },
  MaskedInput: {
    component: MaskedInput,
    name: 'MaskedInput',
    properties: {
      disabled: false,
      mask: MaskedInputMask,
      name: '',
      plain: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      textAlign: ['start', 'center', 'end'],
      value: '',
    },
    override: ({ props }) => {
      const result = {};
      if (props.mask) {
        // convert regexp from string to RegExp
        result.mask = props.mask.map((m) => {
          let regexp;
          if (m.regexp && m.regexp.match) {
            const match = m.regexp.match(/^\/(.*)\/$|(.*)/);
            try {
              if (match) regexp = new RegExp(match[1] || match[2]);
            } catch {
              console.log('Invalid regular expression', m.regexp);
            }
          }
          return { ...m, regexp };
        });
      }
      return result;
    },
  },
  RadioButtonGroup: {
    component: RadioButtonGroup,
    name: 'RadioButtonGroup',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      defaultValue: '',
      direction: BoxDirection,
      disabled: false,
      gap: EdgeSizeOptions({
        options: [
          'none',
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
        ],
      }),
      name: '',
      options: SelectOptions,
      value: '-property- options',
    },
    advancedProperties: ['gap'],
    designProperties: {
      link: ['-link-options-'],
    },
    override: (
      { id, props, designProps },
      { dataContextPath, followLinkOption },
    ) => {
      const result = {};
      if (!props.id) result.id = props.name || id;
      if (!props.value) result.value = undefined;
      if (designProps && designProps.link) {
        result.onChange = ({ target: { value } }) =>
          followLinkOption(designProps.link, value, { dataContextPath });
      }
      return result;
    },
    initialize: ({ props, designProps }, { followLinkOption }) => {
      if (designProps && designProps.link) {
        followLinkOption(designProps.link, props.value);
      }
    },
  },
  RangeInput: {
    component: RangeInput,
    name: 'RangeInput',
    defaultProps: {
      max: 10,
      min: 0,
      step: 1,
    },
    properties: {
      defaultValue: '',
      max: 10,
      min: 0,
      step: 1,
      value: 0,
    },
  },
  Select: {
    component: Select,
    name: 'Select',
    container: 'rarely',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      clear: false,
      closeOnChange: true,
      defaultValue: '',
      disabled: false,
      dropAlign: DropAlign,
      dropHeight: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      icon: ['-Icon-'],
      labelKey: '',
      multiple: false,
      name: '',
      options: SelectOptions,
      placeholder: '',
      plain: false,
      searchPlaceholder: '',
      size: ['small', 'medium', 'large', 'xlarge'],
      value: '',
      valueKey: '',
    },
    designProperties: {
      data: JsonData,
      link: ['-link-options-'],
    },
    override: (
      { children, props, designProps },
      { followLinkOption, renderComponent },
    ) => {
      const result = {};
      if (props.searchPlaceholder) result.onSearch = (text) => {};
      if (!props.value) result.value = undefined;
      if (designProps && designProps.link) {
        result.onChange = ({ value }) =>
          followLinkOption(designProps.link, value);
      }
      if (
        props.options.length === 0 &&
        designProps &&
        designProps.data &&
        Array.isArray(designProps.data)
      ) {
        result.options = designProps.data;
      }
      if (props.valueKey)
        result.valueKey = { key: props.valueKey, reduce: true };
      if (children && children[0]) {
        result.children = (option) =>
          renderComponent(children[0], { datum: option });
      }
      return result;
    },
    initialize: ({ props, designProps }, { followLinkOption }) => {
      if (designProps && designProps.link) {
        followLinkOption(designProps.link, props.value || props.defaultValue);
      }
    },
  },
  TextArea: {
    component: TextArea,
    name: 'TextArea',
    properties: {
      defaultValue: '',
      disabled: false,
      fill: false,
      name: '',
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
      defaultValue: '',
      disabled: false,
      icon: ['-Icon-'],
      name: '',
      placeholder: '',
      plain: false,
      reverse: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      suggestions: TextInputSuggestions,
      textAlign: ['start', 'center', 'end'],
      type: ['text', 'password'],
      value: '',
    },
    override: ({ props }, { replaceData }) => ({
      defaultValue:
        typeof props.defaultValue === 'string'
          ? replaceData(props.defaultValue)
          : props.defaultValue,
    }),
  },
  Avatar: {
    component: Avatar,
    name: 'Avatar',
    container: true,
    help: `Typically an Avatar has either a background, a src,
    or an Icon child.`,
    placeholder: ({ background, src }) =>
      !src &&
      !background && (
        <Text size="large" textAlign="center" color="placeholder">
          ?
        </Text>
      ),
    documentation: 'https://v2.grommet.io/avatar',
    defaultProps: {
      align: 'center',
      flex: false,
      justify: 'center',
      overflow: 'hidden',
      round: 'full',
    },
    properties: {
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      src: ImageSrc,
      background: reusedBoxProps.background,
      border: reusedBoxProps.border,
      gridArea: reusedBoxProps.gridArea,
      margin: reusedBoxProps.margin,
    },
    advancedProperties: ['border', 'gridArea', 'margin'],
  },
  Calendar: {
    component: Calendar,
    name: 'Calendar',
    help: `The 'date' and 'reference' properties needs to be in ISO8601 format.
    `,
    container: 'rarely',
    defaultProps: {
      locale: 'en-US',
      showAdjacentDays: true,
    },
    properties: {
      animate: false,
      date: '',
      daysOfWeek: false,
      fill: false,
      firstDayOfWeek: [0, 1],
      header: '-component-',
      locale: '',
      margin: Edge,
      range: false,
      reference: '',
      showAdjacentDays: false,
      size: ['small', 'medium', 'large'],
    },
    override: ({ children, props }, { renderComponent }) => {
      const result = {};
      if (props.header) {
        result.header = (datum) => {
          return renderComponent(props.header, { datum });
        };
      }
      if (children) {
        result.children = (datum) => renderComponent(children[0], { datum });
      }
      return result;
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
  DataChart: {
    component: DataChart,
    name: 'DataChart',
    defaultProps: {
      axis: { x: { granularity: 'coarse' }, y: { granularity: 'coarse' } },
      chart: [{ property: 'amount' }],
      data: [
        { date: '2020-01-15', amount: 22 },
        { date: '2020-02-15', amount: 11 },
        { date: '2020-03-15', amount: 33 },
        { date: '2020-04-15', amount: 77 },
        { date: '2020-05-15', amount: 88 },
      ],
      gap: 'xsmall',
      guide: { x: { granularity: 'coarse' }, y: { granularity: 'coarse' } },
      series: ['date', 'amount'],
    },
    properties: {
      axis: {
        x: {
          property: '',
          granularity: ['coarse', 'medium', 'fine'],
        },
        y: {
          property: '',
          granularity: ['coarse', 'medium', 'fine'],
        },
      },
      chart: DataChartChart,
      data: JsonData,
      detail: false,
      gap: EdgeSizeOptions({
        options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
        direction: 'row',
      }),
      guide: {
        x: {
          granularity: ['coarse', 'medium', 'fine'],
        },
        y: {
          granularity: ['coarse', 'medium', 'fine'],
        },
      },
      legend: false,
      margin: Edge,
      offset: false,
      series: DataChartSeries,
      size: {
        height: [
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
          'fill',
        ],
        width: [
          'xxsmall',
          'xsmall',
          'small',
          'medium',
          'large',
          'xlarge',
          'fill',
        ],
      },
    },
    designProperties: {
      dataPath: '',
    },
    override: ({ props }, { data }) => {
      const result = {};
      // need to use retrieved data for data property
      if (data) result.data = data;
      // if (props.xAxis && props.xAxis.render) {
      //   if (props.xAxis.key) {
      //     result.yAxis.render = (i) => {
      //       new Date(props.data[i][props.key]).toLocaleDateString('en-US', {
      //         month: 'narrow',
      //       })
      //     }
      //   }
      // }
      return result;
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
      background: {
        header: {
          color: ['-color-'],
          opacity: ['weak', 'medium', 'strong'],
        },
        footer: {
          color: ['-color-'],
          opacity: ['weak', 'medium', 'strong'],
        },
      },
      columns: DataTableColumns,
      data: JsonData,
      fill: [true, 'horizontal', 'vertical', false],
      groupBy: '',
      onClickRow: ['-link-'],
      onSelect: false,
      pad: BoxPad,
      paginate: false,
      pin: [true, 'header', 'footer', false],
      primaryKey: DataTablePrimaryKey,
      replace: false,
      resizeable: false,
      select: '',
      size: ['small', 'medium', 'large', 'xlarge'],
      sortable: false,
    },
    designProperties: {
      dataPath: '',
    },
    override: (
      { props },
      { data, dataContextPath, followLink, renderComponent },
    ) => {
      const result = {};
      // need to use retrieved data for data property
      if (data) result.data = data;
      if (props.onClickRow) {
        result.onClickRow = (event) => {
          event.stopPropagation();
          const { index } = event;
          const path = dataContextPath ? [...dataContextPath, index] : [index];
          followLink(props.onClickRow, { dataContextPath: path });
        };
      }
      if (props.onSelect) result.onSelect = (text) => {};
      if (props.select)
        result.select = props.select.split(',').map((s) => s.trim());
      // adjust render columns
      result.columns = props.columns.map((c) => ({
        ...c,
        render: c.render
          ? (datum) => renderComponent(c.render, { datum })
          : undefined,
      }));
      return result;
    },
    copy: (source, copy, { nextDesign, duplicateComponent }) => {
      // duplicate any columns render components
      if (source.props?.columns) {
        source.props.columns.forEach((column, index) => {
          if (column.render) {
            copy.props.columns[index].render = duplicateComponent({
              nextDesign,
              id: column.render,
            });
          }
        });
      }
    },
  },
  Distribution: {
    component: Distribution,
    name: 'Distribution',
    help: `The 'values' property needs to be ordered largest to
    smallest.
    `,
    defaultProps: {
      gap: 'xsmall',
      values: [
        { label: 'first', value: 45 },
        { label: 'second', value: 32 },
        { label: 'third', value: 25 },
        { label: 'fourth', value: 17 },
        { label: 'fifth', value: 8 },
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
      render: '-component-',
    },
    override: ({ designProps, props }, { data, renderComponent }) => {
      const result = {};
      // need to use retrieved data for values property
      if (data) result.values = data;
      result.children = (value) => {
        const index = (result.values || props.values || []).indexOf(value);
        if (designProps && designProps.render)
          return renderComponent(designProps.render, { datum: value });
        return (
          <Box
            fill
            background={value.color || `graph-${index}`}
            pad="xsmall"
            direction="row"
            gap="small"
          >
            <Text truncate>{value.label}</Text>
            <Text truncate weight="bold">
              {value.value}
            </Text>
          </Box>
        );
      };
      return result;
    },
  },
  Diagram: {
    component: Diagram,
    name: 'Diagram',
    properties: {
      animation: false,
      connections: DiagramConnections,
    },
  },
  List: {
    component: List,
    name: 'List',
    container: true,
    defaultProps: {
      data: [
        { name: 'Eric', count: 5 },
        { name: 'Shimi', count: 7 },
      ],
    },
    properties: {
      data: JsonData,
      onClickItem: ['-link-'],
      onOrder: false,
      pad: BoxPad,
      paginate: false,
      primaryKey: '',
      secondaryKey: '',
    },
    designProperties: {
      dataPath: '',
    },
    override: (
      { children, props },
      { data, dataContextPath, followLink, renderComponent, setData },
    ) => {
      const result = {};
      // need to use retrieved data for data property
      if (data) result.data = data;
      if (props.onClickItem) {
        result.onClickItem = (event) => {
          event.stopPropagation();
          const { index } = event;
          const path = dataContextPath ? [...dataContextPath, index] : [index];
          followLink(props.onClickItem, { dataContextPath: path });
        };
      }
      if (props.onOrder) {
        result.onOrder = setData;
      }
      if (children) {
        result.children = (value) =>
          renderComponent(children[0], { datum: value });
      }
      return result;
    },
  },
  Meter: {
    component: Meter,
    name: 'Meter',
    properties: {
      background: ['-color-'],
      color: ['-color-'],
      max: 100,
      round: false,
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'full'],
      thickness: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      type: ['bar', 'circle', 'pie', 'semicircle'],
      value: 0,
      values: MeterValues,
    },
    override: ({ props }, { replaceData }) => ({
      value:
        typeof props.value === 'string'
          ? replaceData(props.value)
          : props.value,
    }),
  },
  NameValueList: {
    component: NameValueList,
    name: 'NameValueList',
    container: true,
    documentation: 'https://v2.grommet.io/namevaluelist',
    defaultProps: {
      layout: 'column',
    },
    properties: {
      align: ['stretch', 'start', 'center', 'end'],
      layout: ['column', 'grid'],
      margin: Edge,
      nameProps: {
        align: ['stretch', 'start', 'center', 'end'],
        width: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      },
      pairProps: {
        direction: ['column', 'column-reverse', 'row'],
      },
      valueProps: {
        align: ['stretch', 'start', 'center', 'end'],
        width: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      },
    },
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This NameValueList is currently empty. Add NameValuePair components to
        it.
      </Paragraph>
    ),
  },
  NameValuePair: {
    component: NameValuePair,
    name: 'NameValuePair',
    container: true,
    documentation: 'https://v2.grommet.io/namevaluepair',
    properties: {
      name: '',
    },
    designProperties: {
      value: '',
    },
    override: ({ designProps, props }, { replaceData }) => {
      const result = {};
      if (designProps?.value !== undefined)
        result.children = replaceData(designProps.value);
      return result;
    },
  },
  Pagination: {
    component: Pagination,
    name: 'Pagination',
    defaultProps: {
      numberItems: 27,
    },
    properties: {
      numberEdgePages: 1,
      numberItems: 27,
      numberMiddlePages: 3,
      size: ['small', 'medium', 'large'],
    },
  },
  Spinner: {
    component: Spinner,
    name: 'Spinner',
    properties: {
      size: ['small', 'medium', 'large'],
    },
  },
  Tag: {
    component: Tag,
    name: 'Tag',
    documentation: 'https://v2.grommet.io/tag',
    defaultProps: {
      value: 'Tag',
    },
    properties: {
      name: '',
      value: 'Tag',
      onClick: ['-link-'],
      removable: false,
    },
    override: ({ props }, { dataContextPath, followLink }) => {
      return {
        onClick:
          props && props.onClick
            ? (event) => {
                event.stopPropagation();
                followLink(props.onClick, { dataContextPath });
              }
            : undefined,
        onRemove: props && props.removable ? () => {} : undefined,
      };
    },
  },
  Carousel: {
    component: Carousel,
    name: 'Carousel',
    container: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Carousel is currently empty. Add components to it, so it can do its
        thing.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/carousel',
    properties: {
      controls: [true, false, 'arrows', 'selectors'],
      fill: [true, false],
      initialChild: 0,
      margin: Edge,
      play: 0,
    },
  },
  Image: {
    component: Image,
    name: 'Image',
    defaultProps: {
      src: 'https://photos.smugmug.com/Pinnacles-May-2019/n-8KLNDR/i-bxkrqwL/0/1c7fa7f2/M/i-bxkrqwL-M.jpg',
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
      camera: false,
      source: '',
    },
    override: ({ designProps, id }, { replaceData }) => {
      const result = {};
      if (designProps?.source) {
        const source = replaceData(designProps.source);
        result.children = <source src={source} />;
      }
      if (designProps?.camera) {
        result.id = id;
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (stream) {
              const video = document.getElementById(id);
              video.srcObject = stream;
            })
            .catch(function (err) {
              console.error('Something went wrong!', err);
            });
        }
        result.style = { transform: 'scale(-1, 1)' };
      }
      return result;
    },
  },
  WorldMap: {
    component: WorldMap,
    name: 'WorldMap',
    properties: {
      color: ['-color-'],
      fill: ['horizontal', 'vertical', true, false],
      gridArea: BoxGridArea,
      hoverColor: ['-color-'],
      margin: Edge,
      places: WorldMapPlaces,
    },
    override: ({ props }, { renderComponent }) => {
      const result = {};
      if (props.places) {
        // adjust places content
        result.places = props.places.map((p) => ({
          ...p,
          content: p.content ? renderComponent(p.content) : undefined,
        }));
      }
      return result;
    },
    copy: (source, copy, { nextDesign, duplicateComponent }) => {
      // duplicate any places content components
      if (source.props?.places) {
        source.props.places.forEach((place, index) => {
          if (place.content) {
            copy.props.places[index].content = duplicateComponent({
              nextDesign,
              id: place.content,
            });
          }
        });
      }
    },
  },
};
