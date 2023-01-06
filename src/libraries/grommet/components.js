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
  Notification,
  Page,
  PageContent,
  PageHeader,
  Pagination,
  Paragraph,
  RadioButtonGroup,
  RangeInput,
  Select,
  SelectMultiple,
  Sidebar,
  Spinner,
  Stack,
  StarRating,
  Tab,
  Tabs,
  Tag,
  Text,
  TextArea,
  TextInput,
  ThumbsRating,
  Tip,
  Video,
  WorldMap,
} from 'grommet';
import {
  getDataByPath,
  replaceWithData,
  resetDataByPath,
  setDataByPath,
  setDataIndex,
  setProperty,
} from '../../design2';
import DesignComponent from '../../DesignComponent';
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
import DataChartAxis from './DataChartAxis';
import DataChartBounds from './DataChartBounds';
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

// where we hold changed input values so we can track uncontrolled components
const inputValues = {}; // { component-id: value }

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
      alignSelf: ['stretch', 'start', 'center', 'end', 'baseline'],
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
      a11yTitle: '',
      hoverIndicator: BoxHoverIndicator,
      onClick: ['-link-'],
      responsive: true,
      round: BoxRound,
      skeleton: false,
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
        properties: [
          'animation',
          'background',
          'border',
          'elevation',
          'round',
          'skeleton',
        ],
      },
      {
        label: 'Interaction',
        properties: ['a11yTitle', 'onClick', 'hoverIndicator'],
      },
    ],
    adjustProps: (props, { followLink }) => {
      const adjusted = {};
      if (props?.onClick)
        adjusted.onClick = (event) => {
          event.stopPropagation();
          followLink(props.onClick);
        };
      return { ...props, ...adjusted };
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
    properties: {
      ...reusedBoxProps,
      width: Dimension,
      wrap: false,
    },
    structure: [
      {
        label: reusedBoxStructure[0].label,
        properties: [...reusedBoxStructure[0].properties, 'wrap'],
      },
      {
        label: reusedBoxStructure[1].label,
        properties: [...reusedBoxStructure[1].properties, 'width'],
      },
      reusedBoxStructure[2],
    ],
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
    properties: {
      ...reusedBoxProps,
      wrap: false,
    },
    structure: [
      {
        label: reusedBoxStructure[0].label,
        properties: [...reusedBoxStructure[0].properties, 'wrap'],
      },
      reusedBoxStructure[1],
      reusedBoxStructure[2],
    ],
  },
  Page: {
    component: Page,
    name: 'Page',
    container: true,
    hideable: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This Page is currently empty. Add a PageContent to it.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/page',
    properties: {
      background: reusedBoxProps.background,
      fill: reusedBoxProps.fill,
      kind: ['wide', 'narrow', 'full'],
    },
  },
  PageContent: {
    component: PageContent,
    name: 'PageContent',
    container: true,
    hideable: true,
    placeholder: () => (
      <Paragraph size="large" textAlign="center" color="placeholder">
        This PageContent is currently empty. Add some content to it.
      </Paragraph>
    ),
    documentation: 'https://v2.grommet.io/page',
    properties: {
      align: reusedBoxProps.align,
      justify: reusedBoxProps.justify,
      background: { ...reusedBoxProps.background, fill: ['horizontal'] },
      border: reusedBoxProps.border,
      gap: reusedBoxProps.gap,
      pad: reusedBoxProps.pad,
      flex: reusedBoxProps.flex,
      skeleton: false,
    },
  },
  PageHeader: {
    component: PageHeader,
    name: 'PageHeader',
    container: true,
    hideable: true,
    documentation: 'https://v2.grommet.io/page',
    properties: {
      title: '',
      subtitle: '',
      a11yTitle: '',
      actions: '-component-',
      margin: Edge,
      pad: Edge,
      parent: '-string-or-component-',
    },
    adjustProps: (props) => {
      const adjusted = {};
      if (props.title) adjusted.title = replaceWithData(props.title);
      if (props.subtitle) adjusted.subtitle = replaceWithData(props.subtitle);
      if (props.parent && typeof props.parent === 'number') {
        adjusted.parent = <DesignComponent id={props.parent} />;
      }
      return { ...props, ...adjusted };
    },
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
      a11yTitle: '',
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
    hideable: true,
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
      a11yTitle: '',
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
        properties: ['a11yTitle', 'onClick', 'hoverIndicator'],
      },
    ],
    adjustProps: (props, { followLink }) => {
      const adjusted = {};
      if (props?.onClick)
        adjusted.onClick = (event) => {
          event.stopPropagation();
          followLink(props.onClick);
        };
      return { ...props, ...adjusted };
    },
  },
  CardHeader: {
    component: CardHeader,
    name: 'CardHeader',
    container: true,
    hideable: true,
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
    hideable: true,
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
    properties: { ...reusedBoxProps, wrap: false },
    structure: [
      {
        label: reusedBoxStructure[0].label,
        properties: [...reusedBoxStructure[0].properties, 'wrap'],
      },
      reusedBoxStructure[1],
      reusedBoxStructure[2],
    ],
  },
  CardFooter: {
    component: CardFooter,
    name: 'CardFooter',
    container: true,
    hideable: true,
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
    dynamically shown via a Button or Menu link, List onClickItem,
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
      position: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'start',
        'end',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      responsive: false,
    },
    advancedProperties: ['animate', 'responsive'],
    adjustProps: (props, { component: { id } }) => {
      const adjusted = {};
      if (props.modal !== false && props.onClickOutside !== 'ignore') {
        adjusted.onClickOutside = (event) => {
          let node = event.target;
          // only hide if clicking the modal overlay, which is outside root
          while (node && node.id !== 'root') node = node.parentNode;
          if (!node) setProperty(id, undefined, 'hide', true);
        };
      } else if (props.modal === false && props.onClickOutside === 'hide') {
        adjusted.onClickOutside = (event) => {
          let node = event.target;
          // only hide if clicking within the Canvas
          while (node && node.id !== 'designer-canvas') node = node.parentNode;
          if (node) setProperty(id, undefined, 'hide', true);
        };
      } else adjusted.onClickOutside = undefined;
      adjusted.onEsc = () => setProperty(id, undefined, 'hide', true);
      adjusted.target = document.getElementById('designer-canvas');
      return { ...props, ...adjusted };
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
      a11yTitle: '',
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
      a11yTitle: '',
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
      a11yTitle: '',
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
      tip: '',
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
      a11yTitle: '',
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
      label: '-string-or-component-',
    },
    adjustProps: (props, { component: { designProps } }) => {
      const adjusted = {};
      if (props.label && typeof props.label === 'number') {
        adjusted.label = <DesignComponent id={props.label} />;
      }
      return { ...props, ...adjusted };
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
      a11yTitle: '',
      color: ['-color-'],
      disabled: false,
      gap: reusedBoxProps.gap,
      href: '',
      icon: ['-Icon-'],
      margin: Edge,
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', '2xl'],
    },
    designProperties: {
      link: ['-link-'],
    },
    advancedProperties: ['margin', 'color'],
    adjustProps: (props, { component, datum, followLink }) => {
      const adjusted = {};
      if (props.label) adjusted.label = replaceWithData(props.label, datum);
      if (component?.designProps?.link)
        adjusted.onClick = (event) => {
          event.stopPropagation();
          followLink(component.designProps.link);
        };
      return { ...props, ...adjusted };
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
      a11yTitle: '',
      tip: '',
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
      type: ['button', 'reset', 'submit'],
    },
    designProperties: {
      link: ['-link-'],
    },
    advancedProperties: ['color', 'fill', 'gap', 'margin', 'size'],
    adjustProps: (props, { component, datum, followLink }) => {
      const adjusted = {};
      if (props.label) adjusted.label = replaceWithData(props.label, datum);
      if (props.badge !== undefined)
        adjusted.badge = props.badge === 0 ? true : props.badge;
      if (component?.designProps?.link)
        adjusted.onClick = (event) => {
          event.stopPropagation();
          followLink(component.designProps.link);
        };
      return { ...props, ...adjusted };
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
      label: 'Click Me',
      icon: ['-Icon-'],
      a11yTitle: '',
      tip: '',
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
      kind: ['-theme-'],
      margin: Edge,
      open: [true, false],
      plain: false,
      primary: false,
      reverse: false,
      secondary: false,
      size: ['small', 'medium', 'large'],
    },
    advancedProperties: ['color', 'disabled', 'gap', 'margin'],
    adjustProps: (props, { component, followLink }) => {
      const adjusted = {};
      if (props.badge !== undefined)
        adjusted.badge = props.badge === 0 ? true : props.badge;
      return { ...props, ...adjusted };
    },
  },
  Menu: {
    component: Menu,
    name: 'Menu',
    defaultProps: {
      label: 'Menu',
    },
    properties: {
      label: 'Actions',
      icon: ['-Icon-'],
      a11yTitle: '',
      items: MenuItems,
      disabled: false,
      dropAlign: DropAlign,
      dropBackground: {
        color: ['-color-'],
        opacity: ['weak', 'medium', 'strong'],
      },
      kind: ['-theme-'],
      open: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      tip: '',
    },
    adjustProps: (props, { followLink }) => {
      const adjusted = {};
      adjusted.items = (props.items || []).map((item) => {
        if (Array.isArray(item)) {
          return item.map((subItem) => ({
            ...subItem,
            onClick: (event) => {
              event.stopPropagation();
              followLink(subItem.link);
            },
          }));
        } else {
          return {
            ...item,
            onClick: (event) => {
              event.stopPropagation();
              followLink(item.link);
            },
          };
        }
      });
      return { ...props, ...adjusted };
    },
    relink: (component, { relink }) => {
      component.props?.items.forEach((item) => {
        if (item?.link) item.link = relink(item.link);
      });
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
      a11yTitle: '',
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
    adjustProps: (props, { datum }) => {
      const adjusted = {};
      if (props.title) adjusted.title = replaceWithData(props.title, datum);
      return { ...props, ...adjusted };
    },
  },
  Tip: {
    component: Tip,
    name: 'Tip',
    container: true,
    documentation: 'https://v2.grommet.io/tip',
    properties: {
      content: '',
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
      name: '',
      a11yTitle: '',
      checked: '-string-or-boolean-',
      defaultChecked: '-string-or-boolean-',
      disabled: false,
      label: 'enabled?',
      reverse: false,
      toggle: false,
    },
    designProperties: {
      dataPath: '',
      link: ['-link-checked-'],
    },
    adjustProps: (
      props,
      { component: { children, designProps }, datum, followLinkOption },
    ) => {
      const adjusted = {
        onChange: designProps?.link
          ? (event) => followLinkOption(designProps.link, event.target.checked)
          : undefined,
      };
      // set unique id if we have a datum, so CheckBoxes in List work
      if (datum)
        adjusted.id = JSON.stringify(datum).replace(/[^a-zA-Z0-9]/g, '-');
      if (props.label) adjusted.label = replaceWithData(props.label, datum);
      if (typeof props.defaultChecked === 'string')
        adjusted.defaultChecked = getDataByPath(props.defaultChecked, datum);
      if (typeof props.checked === 'string')
        adjusted.checked = getDataByPath(props.checked, datum);
      if (designProps?.dataPath)
        adjusted.checked = getDataByPath(designProps.dataPath, datum);
      if (children && children[0]) {
        adjusted.children = (state) => (
          <DesignComponent id={children[0]} datum={state} />
        );
      }
      return { ...props, ...adjusted };
    },
    initialize: (props, { component: { designProps }, followLinkOption }) => {
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
      name: '',
      a11yTitle: '',
      options: SelectOptions,
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
      value: ['-property- options'],
      defaultValue: ['-property- options'],
    },
    advancedProperties: ['gap'],
    designProperties: {
      dataPath: '',
      link: ['-link-options-'],
    },
    adjustProps: (
      props,
      { component: { designProps, id }, followLinkOption },
    ) => {
      const adjusted = {};
      if (!props.id) adjusted.id = props.name || id;
      if (!props.value) adjusted.value = undefined;
      if (designProps?.link) {
        adjusted.onChange = ({ value }) =>
          followLinkOption(designProps.link, value);
      }
      if (designProps?.dataPath)
        adjusted.options = getDataByPath(designProps.dataPath);
      return { ...props, ...adjusted };
    },
    initialize: (props, { component: { designProps }, followLinkOption }) => {
      if (designProps?.link) {
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
      name: '',
      a11yTitle: '',
      defaultValue: '',
      disabled: false,
      inline: false,
      format: '',
      value: '',
    },
  },
  FileInput: {
    component: FileInput,
    name: 'FileInput',
    properties: {
      name: '',
      a11yTitle: '',
      disabled: false,
      id: '',
      multiple: false,
      renderFile: '-component- grommet.Box {"pad":"small"}',
    },
  },
  Form: {
    component: Form,
    container: true,
    hideable: true,
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
    properties: {
      kind: '',
    },
    // // action to auto-build FormFields based on dataPath
    // actions: (
    //   { designProps, id },
    //   { addChildComponent, changeDesign, data, design },
    // ) => {
    //   if (
    //     designProps?.dataPath &&
    //     typeof data?.[designProps.dataPath] === 'object'
    //   ) {
    //     return (
    //       <Box direction="row" justify="end" pad="small">
    //         <Button
    //           label="generate fields"
    //           onClick={() => {
    //             // add FormField and TextInput children for all keys in the data
    //             const nextDesign = JSON.parse(JSON.stringify(design));
    //             const nextForm = nextDesign.components[id];
    //             Object.keys(data[designProps.dataPath]).forEach((key) => {
    //               // see if we already have a FormField with this name
    //               if (
    //                 !nextForm.children ||
    //                 !nextForm.children.some(
    //                   (childId) =>
    //                     nextDesign.components[childId].props?.name === key,
    //                 )
    //               ) {
    //                 const fieldId = addChildComponent(nextDesign, id, {
    //                   type: 'grommet.FormField',
    //                   props: { label: key, name: key },
    //                 });
    //                 addChildComponent(nextDesign, fieldId, {
    //                   type: 'grommet.TextInput',
    //                   props: { name: key },
    //                 });
    //               }
    //             });
    //             changeDesign(nextDesign);
    //           }}
    //         />
    //       </Box>
    //     );
    //   }
    // },
    adjustProps: (props, { component, rerender }) => {
      let adjusted = {};
      const dataPath = component?.designProps?.dataPath;
      if (dataPath) {
        adjusted = {
          value: getDataByPath(dataPath) || {},
          onChange: (value) => {
            setDataByPath(dataPath, value);
            rerender(value);
          },
          onReset: () => {
            resetDataByPath(dataPath);
            rerender(undefined);
          },
        };
      }
      return { ...props, ...adjusted };
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
    documentation: 'https://v2.grommet.io/formfield',
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
    documentation: 'https://v2.grommet.io/maskedinput',
    properties: {
      name: '',
      a11yTitle: '',
      disabled: false,
      mask: MaskedInputMask,
      plain: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      textAlign: ['start', 'center', 'end'],
      value: '',
    },
    adjustProps: (props) => {
      const adjusted = {};
      if (props.mask) {
        // convert regexp from string to RegExp
        adjusted.mask = props.mask.map((m) => {
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
      return { ...props, ...adjusted };
    },
  },
  RadioButtonGroup: {
    component: RadioButtonGroup,
    name: 'RadioButtonGroup',
    documentation: 'https://v2.grommet.io/radiobuttongroup',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      name: '',
      a11yTitle: '',
      options: SelectOptions,
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
      value: '-property- options',
    },
    advancedProperties: ['gap'],
    designProperties: {
      dataPath: '',
      link: ['-link-options-'],
    },
    adjustProps: (
      props,
      { component: { designProps, id }, followLinkOption },
    ) => {
      const adjusted = {};
      if (!props.id) adjusted.id = props.name || id;
      if (!props.value) adjusted.value = undefined;
      if (designProps?.link) {
        adjusted.onChange = ({ target: { value } }) =>
          followLinkOption(designProps.link, value);
      }
      if (designProps?.dataPath)
        adjusted.options = getDataByPath(designProps.dataPath);
      return { ...props, ...adjusted };
    },
    initialize: (props, { component: { designProps }, followLinkOption }) => {
      if (designProps?.link) {
        followLinkOption(designProps.link, props.value || props.defaultValue);
      }
    },
  },
  RangeInput: {
    component: RangeInput,
    name: 'RangeInput',
    documentation: 'https://v2.grommet.io/rangeinput',
    defaultProps: {
      max: 10,
      min: 0,
      step: 1,
    },
    properties: {
      name: '',
      a11yTitle: '',
      defaultValue: '',
      max: 10,
      min: 0,
      step: 1,
    },
  },
  Select: {
    component: Select,
    name: 'Select',
    container: 'rarely',
    documentation: 'https://v2.grommet.io/select',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      name: '',
      a11yTitle: '',
      options: SelectOptions,
      clear: false,
      closeOnChange: true,
      defaultValue: '',
      disabled: false,
      dropAlign: DropAlign,
      dropHeight: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      icon: ['-Icon-'],
      labelKey: '',
      multiple: false,
      placeholder: '',
      plain: false,
      searchPlaceholder: '',
      size: ['small', 'medium', 'large', 'xlarge'],
      value: '',
      valueKey: '',
      valueLabel: '-component-',
    },
    designProperties: {
      dataPath: '',
      data: JsonData,
      link: ['-link-options-'],
    },
    adjustProps: (
      props,
      { component: { id, children, designProps }, followLinkOption },
    ) => {
      const adjusted = {};
      if (props.searchPlaceholder) adjusted.onSearch = (text) => {};
      if (!props.value) adjusted.value = undefined;
      if (designProps?.link) {
        adjusted.onChange = ({ value }) => {
          followLinkOption(designProps.link, value);
          inputValues[id] = value;
        };
      } else {
        adjusted.onChange = ({ value }) => (inputValues[id] = value);
      }
      if (
        props.options.length === 0 &&
        designProps?.data &&
        Array.isArray(designProps.data)
      ) {
        adjusted.options = designProps.data;
      }
      if (designProps?.dataPath)
        adjusted.options = getDataByPath(designProps.dataPath) || [];
      if (props.valueKey)
        adjusted.valueKey = { key: props.valueKey, reduce: true };
      if (children && children[0]) {
        adjusted.children = (option, index, options, state) => (
          <DesignComponent id={children[0]} datum={{ ...option, ...state }} />
        );
      }
      if (props.valueLabel) {
        if (props.value || inputValues[id] || props.defaultValue) {
          adjusted.valueLabel = (
            <DesignComponent
              id={props.valueLabel}
              datum={
                props.value ||
                inputValues[id] ||
                props.defaultValue ||
                props.placeholder
              }
            />
          );
        } else {
          adjusted.valueLabel = undefined;
        }
      }
      return { ...props, ...adjusted };
    },
    initialize: (props, { component: { designProps }, followLinkOption }) => {
      if (designProps?.link) {
        followLinkOption(designProps.link, props.value || props.defaultValue);
      }
    },
  },
  SelectMultiple: {
    component: SelectMultiple,
    name: 'SelectMultiple',
    container: 'rarely',
    documentation: 'https://v2.grommet.io/selectmultiple',
    defaultProps: {
      options: ['option 1', 'option 2'],
    },
    properties: {
      name: '',
      a11yTitle: '',
      options: SelectOptions,
      defaultValue: ['-property- options'],
      disabled: false,
      dropAlign: DropAlign,
      dropHeight: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      icon: ['-Icon-'],
      labelKey: '',
      limit: 0,
      placeholder: '',
      plain: false,
      searchPlaceholder: '',
      showSelectedInline: true,
      size: ['small', 'medium', 'large', 'xlarge'],
      value: ['-property- options'],
      valueKey: '',
      valueLabel: '-component-',
    },
    designProperties: {
      dataPath: '',
      data: JsonData,
      link: ['-link-options-'],
    },
    adjustProps: (
      props,
      { component: { id, children, designProps }, followLinkOption },
    ) => {
      const adjusted = {};
      if (props.searchPlaceholder) adjusted.onSearch = (text) => {};
      if (!props.value) adjusted.value = undefined;
      if (designProps?.link) {
        adjusted.onChange = ({ value }) => {
          followLinkOption(designProps.link, value);
          inputValues[id] = value;
        };
      } else {
        adjusted.onChange = ({ value }) => (inputValues[id] = value);
      }
      if (
        props.options.length === 0 &&
        designProps?.data &&
        Array.isArray(designProps.data)
      ) {
        adjusted.options = designProps.data;
      }
      if (designProps?.dataPath)
        adjusted.options = getDataByPath(designProps.dataPath);
      if (props.valueKey)
        adjusted.valueKey = { key: props.valueKey, reduce: true };
      if (children && children[0]) {
        adjusted.children = (option, index, options, state) => (
          <DesignComponent id={children[0]} datum={{ ...option, ...state }} />
        );
      }
      if (props.valueLabel) {
        if (props.value || inputValues[id] || props.defaultValue) {
          adjusted.valueLabel = (
            <DesignComponent
              id={props.valueLabel}
              datum={
                props.value ||
                inputValues[id] ||
                props.defaultValue ||
                props.placeholder
              }
            />
          );
        } else {
          adjusted.valueLabel = undefined;
        }
      }
      return { ...props, ...adjusted };
    },
    initialize: (props, { component: { designProps }, followLinkOption }) => {
      if (designProps?.link) {
        followLinkOption(designProps.link, props.value || props.defaultValue);
      }
    },
  },
  StarRating: {
    component: StarRating,
    name: 'StarRating',
    documentation: 'https://v2.grommet.io/starrating',
  },
  TextArea: {
    component: TextArea,
    name: 'TextArea',
    documentation: 'https://v2.grommet.io/textarea',
    properties: {
      name: '',
      a11yTitle: '',
      defaultValue: '',
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
    documentation: 'https://v2.grommet.io/textinput',
    properties: {
      name: '',
      a11yTitle: '',
      defaultValue: '',
      disabled: false,
      icon: ['-Icon-'],
      placeholder: '',
      plain: false,
      reverse: false,
      size: ['small', 'medium', 'large', 'xlarge'],
      suggestions: TextInputSuggestions,
      textAlign: ['start', 'center', 'end'],
      type: ['text', 'password'],
      value: '',
    },
    adjustProps: (props, { datum }) => {
      const adjusted = {
        defaultValue:
          typeof props.defaultValue === 'string'
            ? replaceWithData(props.defaultValue, datum)
            : props.defaultValue,
      };
      return { ...props, ...adjusted };
    },
  },
  ThumbsRating: {
    component: ThumbsRating,
    name: 'ThumbsRating',
    documentation: 'https://v2.grommet.io/thumbsrating',
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
    documentation: 'https://v2.grommet.io/calendar',
    defaultProps: {
      locale: 'en-US',
      showAdjacentDays: true,
    },
    properties: {
      a11yTitle: '',
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
    adjustProps: (props, { component: { children } }) => {
      const adjusted = {};
      if (props.header) {
        adjusted.header = ({ date }) => (
          <DesignComponent
            id={props.header}
            datum={{
              month: date.toLocaleDateString(undefined, { month: 'long' }),
            }}
          />
        );
      }
      if (children) {
        adjusted.children = (datum) => (
          <DesignComponent id={children[0]} datum={datum} />
        );
      }
      return { ...props, ...adjusted };
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
      a11yTitle: '',
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
    adjustProps: (props, { component: { designProps } }) => {
      const adjusted = {};
      if (designProps?.dataPath)
        adjusted.values = getDataByPath(designProps.dataPath);
      return { ...props, ...adjusted };
    },
  },
  Clock: {
    component: Clock,
    name: 'Clock',
    properties: {
      a11yTitle: '',
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
    documentation: 'https://v2.grommet.io/datachart',
    help: `The DataChart can be seen by giving it some 'data' and 'series'.
    You can then customize it from the default by defining 'chart'.
    `,
    defaultProps: {
      axis: true,
      data: [{ amount: 5 }, { amount: 80 }],
      series: ['amount'],
    },
    properties: {
      a11yTitle: '',
      axis: DataChartAxis,
      bounds: DataChartBounds,
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
      pad: BoxPad,
      placeholder: '-string-or-component-',
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
    adjustProps: (props, { component: { designProps } }) => {
      const adjusted = {};
      // need to use retrieved data for data property
      if (designProps?.dataPath)
        adjusted.data = getDataByPath(designProps.dataPath);
      // if (data) adjusted.data = data;
      // if (props.xAxis && props.xAxis.render) {
      //   if (props.xAxis.key) {
      //     result.yAxis.render = (i) => {
      //       new Date(props.data[i][props.key]).toLocaleDateString('en-US', {
      //         month: 'narrow',
      //       })
      //     }
      //   }
      // }
      return { ...props, ...adjusted };
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
      step: 50,
    },
    properties: {
      a11yTitle: '',
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
      placeholder: '-string-or-component-',
      primaryKey: DataTablePrimaryKey,
      replace: false,
      resizeable: false,
      select: '',
      size: ['small', 'medium', 'large', 'xlarge'],
      sortable: false,
      step: 50,
    },
    designProperties: {
      dataPath: '',
    },
    adjustProps: (
      props,
      { component: { designProps, id }, datum, followLink },
    ) => {
      const adjusted = {};
      if (designProps?.dataPath) {
        adjusted.data = getDataByPath(designProps.dataPath, datum);
        if (!Array.isArray(adjusted.data)) {
          console.warn('DataTable data is not an array', adjusted.data);
          adjusted.data = [];
        }
      }
      if (props.onClickRow) {
        if (designProps?.dataPath)
          setDataIndex(designProps.dataPath, undefined);
        adjusted.onClickRow = (event) => {
          event.stopPropagation();
          if (designProps?.dataPath)
            setDataIndex(designProps.dataPath, event.index);
          followLink(props.onClickRow);
        };
      }
      if (props.onSelect)
        adjusted.onSelect = (selected) => (inputValues[id] = selected);
      if (props.select)
        adjusted.select = props.select.split(',').map((s) => s.trim());
      else adjusted.select = inputValues[id];
      adjusted.columns = props.columns.map((c) => ({
        ...c,
        render: c?.render
          ? (datum) => <DesignComponent id={c.render} datum={datum} />
          : undefined,
      }));
      return { ...props, ...adjusted };
    },
    updateDeepPropertyComponents: (source, copy, { idMap }) => {
      // duplicate any columns render components
      if (source.props?.columns) {
        source.props.columns.forEach((column, index) => {
          if (column.render) {
            copy.props.columns[index].render = idMap[column.render];
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
      a11yTitle: '',
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
    adjustProps: (props, { component: { designProps } }) => {
      const adjusted = {};
      // need to use retrieved data for values property
      if (designProps?.dataPath)
        adjusted.values = getDataByPath(designProps.dataPath);
      adjusted.children = (value) => {
        const index = (adjusted.values || props.values || []).indexOf(value);
        if (designProps?.render)
          return <DesignComponent id={designProps.render} datum={value} />;
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
      return { ...props, ...adjusted };
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
      a11yTitle: '',
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
    adjustProps: (
      props,
      { component: { children, designProps }, datum, followLink },
    ) => {
      const adjusted = {};
      // need to use retrieved data for data property
      if (designProps?.dataPath) {
        adjusted.data = getDataByPath(designProps.dataPath, datum);
        if (!Array.isArray(adjusted.data)) {
          console.warn('List data is not an array', adjusted.data);
          adjusted.data = [];
        }
      }
      if (props.onClickItem) {
        if (designProps?.dataPath)
          setDataIndex(designProps.dataPath, undefined);
        adjusted.onClickItem = (event) => {
          event.stopPropagation();
          if (designProps?.dataPath)
            setDataIndex(designProps.dataPath, event.index);
          followLink(props.onClickItem);
        };
      }
      if (props.onOrder && designProps?.dataPath) {
        adjusted.onOrder = (data) => setDataByPath(designProps.dataPath, data);
      }
      if (children) {
        adjusted.children = (value) => (
          <DesignComponent id={children[0]} datum={value} />
        );
      }
      return { ...props, ...adjusted };
    },
  },
  Meter: {
    component: Meter,
    name: 'Meter',
    properties: {
      a11yTitle: '',
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
    designProperties: {
      dataPath: '',
    },
    adjustProps: (props, { datum, component: { designProps } }) => {
      const adjusted = {};
      if (typeof props.value === 'string')
        adjusted.value = parseInt(replaceWithData(props.value, datum), 10);
      if (typeof props.max === 'string')
        adjusted.max = parseInt(replaceWithData(props.max, datum), 10);
      if (Array.isArray(props.values)) {
        adjusted.values = props.values.map((v) => {
          const val = { ...v };
          if (typeof v?.value === 'string')
            val.value = parseInt(replaceWithData(v.value, datum), 10);
          return val;
        });
      }
      if (designProps?.dataPath)
        adjusted.values = getDataByPath(designProps.dataPath);
      return { ...props, ...adjusted };
    },
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
    defaultProps: {
      name: 'name',
    },
    properties: {
      name: '-string-or-component-',
    },
    designProperties: {
      value: '',
    },
    adjustProps: (props, { component: { designProps }, datum }) => {
      const adjusted = {};
      if (designProps?.value !== undefined) {
        adjusted.children = replaceWithData(designProps.value, datum);
      }
      if (props.name && typeof props.name === 'number') {
        adjusted.name = <DesignComponent id={props.name} />;
      }
      return { ...props, ...adjusted };
    },
  },
  Notification: {
    component: Notification,
    name: 'Notification',
    hideable: true,
    documentation: 'https://v2.grommet.io/notification',
    defaultProps: {
      message: 'Special message',
    },
    properties: {
      status: ['critical', 'warning', 'normal', 'unknown', '-data-'],
      message: '',
      title: '',
      time: 4000,
      toast: false,
      global: false,
      onClose: ['-link-'],
      icon: ['-Icon-'],
    },
    adjustProps: (props, { datum, followLink }) => {
      const adjusted = {};
      if (props?.onClose)
        adjusted.onClose = (event) => {
          event.stopPropagation();
          followLink(props.onClose);
        };
      if (props.title) adjusted.title = replaceWithData(props.title, datum);
      if (props.message)
        adjusted.message = replaceWithData(props.message, datum);
      // workaround for Notification not being very defensive
      if (props?.status && (props.status[0] === '{' || props.status[0] === '['))
        adjusted.status = undefined;
      return { ...props, ...adjusted };
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
      a11yTitle: '',
      onClick: ['-link-'],
      removable: false,
    },
    adjustProps: (props, { followLink }) => {
      const adjusted = {};
      if (props?.onClick)
        adjusted.onClick = (event) => {
          event.stopPropagation();
          followLink(props.onClick);
        };
      if (props?.removable) adjusted.onRemove = () => {};
      return { ...props, ...adjusted };
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
      src: ImageSrc,
      a11yTitle: '',
      fill: ['horizontal', 'vertical', true, false],
      fit: ['cover', 'contain'],
      opacity: ['weak', 'medium', 'strong'],
    },
    adjustProps: (props, { datum }) => {
      return { ...props, src: replaceWithData(props.src, datum) };
    },
  },
  Video: {
    component: Video,
    name: 'Video',
    properties: {
      a11yTitle: '',
      autoPlay: false,
      controls: [false, 'over', 'below'],
      fit: ['cover', 'contain'],
      loop: false,
    },
    designProperties: {
      camera: false,
      source: '',
    },
    adjustProps: (props, { component: { designProps, id }, datum }) => {
      const adjusted = {};
      if (designProps?.source) {
        const source = replaceWithData(designProps.source, datum);
        adjusted.children = <source src={source} />;
      }
      if (designProps?.camera) {
        adjusted.id = id;
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
        adjusted.style = { transform: 'scale(-1, 1)' };
      }
      return { ...props, ...adjusted };
    },
  },
  WorldMap: {
    component: WorldMap,
    name: 'WorldMap',
    properties: {
      a11yTitle: '',
      color: ['-color-'],
      fill: ['horizontal', 'vertical', true, false],
      gridArea: BoxGridArea,
      hoverColor: ['-color-'],
      margin: Edge,
      places: WorldMapPlaces,
    },
    adjustProps: (props) => {
      const adjusted = {};
      if (props.places) {
        // adjust places content
        adjusted.places = props.places.map((p) => ({
          ...p,
          content: p.content ? <DesignComponent id={p.content} /> : undefined,
        }));
      }
      return { ...props, ...adjusted };
    },
    updateDeepPropertyComponents: (source, copy, { idMap }) => {
      // duplicate any places content components
      if (source.props?.places) {
        source.props.places.forEach((place, index) => {
          if (place.content) {
            copy.props.places[index].content = idMap[place.content];
          }
        });
      }
    },
  },
};
