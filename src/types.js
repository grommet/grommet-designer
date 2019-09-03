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
  base,
  grommet
} from "grommet";
import Icon, { names as iconNames } from "./Icon";
import Reference from "./Reference";
import ReferenceComponent from "./custom/ReferenceComponent";
import BoxAnimation from "./custom/BoxAnimation";
import BoxBackgroundImage from "./custom/BoxBackgroundImage";
import BoxRound from "./custom/BoxRound";
import BoxGridArea from "./custom/BoxGridArea";
import ChartBounds from "./custom/ChartBounds";
import ChartValues from "./custom/ChartValues";
import GridAreas from "./custom/GridAreas";
import GridColumns from "./custom/GridColumns";
import GridRows from "./custom/GridRows";
import DataTableColumns from "./custom/DataTableColumns";
import DataTableData from "./custom/DataTableData";
import HeadingMargin from "./custom/HeadingMargin";
import ImageSrc from "./custom/ImageSrc";
import MaskedInputMask from "./custom/MaskedInputMask";
import MenuItems from "./custom/MenuItems";
import MeterValues from "./custom/MeterValues";
import SelectOptions from "./custom/SelectOptions";
import TextAreaValue from "./custom/TextAreaValue";
import TextInputSuggestions from "./custom/TextInputSuggestions";
import DropAlign from "./custom/DropAlign";
import Edge from "./custom/Edge";

const internalColors = [
  "active",
  "background",
  "focus",
  "icon",
  "placeholder",
  "selected",
  "text"
];
export const colors = Object.keys({
  ...base.global.colors,
  ...grommet.global.colors
})
  // prune out colors we tend to use internally
  .filter(
    color =>
      typeof base.global.colors[color] === "string" &&
      !internalColors.includes(color)
  )
  .sort((c1, c2) => (c1 > c2 ? 1 : -1)); // sort alphabetically

export const types = {
  Box: {
    component: Box,
    name: "Box",
    container: true,
    defaultProps: {
      align: "center",
      justify: "center",
      pad: "small"
    },
    properties: [
      {
        label: "Content layout",
        properties: {
          align: ["stretch", "start", "center", "end", "baseline"],
          direction: ["column", "row", "row-responsive"],
          gap: ["xsmall", "small", "medium", "large", "xlarge"],
          justify: ["around", "between", "center", "end", "evenly", "start"],
          overflow: ["auto", "hidden", "scroll", "visible"],
          pad: Edge,
          wrap: false
        }
      },
      {
        label: "Layout in container",
        properties: {
          alignSelf: ["stretch", "start", "center", "end"],
          basis: [
            "xxsmall",
            "xsmall",
            "small",
            "medium",
            "large",
            "xlarge",
            "xxlarge",
            "full",
            "1/2",
            "1/3",
            "2/3",
            "1/4",
            "3/4",
            "auto"
          ],
          fill: ["horizontal", "vertical"],
          flex: ["grow", "shrink", true, false],
          gridArea: BoxGridArea,
          height: [
            "xxsmall",
            "xsmall",
            "small",
            "medium",
            "large",
            "xlarge",
            "xxlarge"
          ],
          margin: Edge,
          width: [
            "xxsmall",
            "xsmall",
            "small",
            "medium",
            "large",
            "xlarge",
            "xxlarge"
          ]
        }
      },
      {
        label: "Style",
        properties: {
          animation: BoxAnimation,
          background: {
            color: colors,
            dark: false,
            opacity: ["weak", "medium", "strong"],
            position: ["center", "top", "bottom", "left", "right"],
            image: BoxBackgroundImage
          },
          border: {
            color: colors,
            size: ["xsmall", "small", "medium", "large", "xlarge"],
            side: [
              "all",
              "horizontal",
              "vertical",
              "top",
              "left",
              "bottom",
              "right"
            ],
            style: [
              "solid",
              "dashed",
              "dotted",
              "double",
              "groove",
              "ridge",
              "inset",
              "outset",
              "hidden"
            ]
          },
          elevation: ["none", "xsmall", "small", "medium", "large", "xlarge"],
          round: BoxRound
        }
      }
    ],
    starters: [
      {
        name: "header",
        root: 213,
        components: {
          "213": {
            type: "Box",
            id: 213,
            props: {
              align: "center",
              justify: "between",
              direction: "row",
              flex: false
            }
          }
        }
      },
      {
        name: "list",
        root: 4,
        components: {
          "4": {
            type: "Box",
            id: 4,
            props: {},
            children: [5],
            name: "list"
          },
          "5": {
            type: "Repeater",
            id: 5,
            props: {
              count: 5
            },
            children: [9]
          },
          "6": {
            type: "Box",
            id: 6,
            props: {
              align: "center",
              justify: "between",
              pad: {
                horizontal: "medium",
                vertical: "small"
              },
              direction: "row"
            },
            children: [7, 8]
          },
          "7": {
            type: "Text",
            id: 7,
            props: {
              weight: "bold"
            },
            text: "name"
          },
          "8": {
            type: "Text",
            id: 8,
            props: {},
            text: "detail"
          },
          "9": {
            type: "Button",
            id: 9,
            props: {
              hoverIndicator: true
            },
            children: [6]
          }
        }
      }
    ]
  },
  Grid: {
    component: Grid,
    name: "Grid",
    container: true,
    properties: {
      align: ["stretch", "start", "center", "end"],
      alignContent: ["stretch", "start", "center", "end"],
      areas: GridAreas,
      columns: GridColumns,
      fill: ["horizontal", "vertical"],
      gap: ["xsmall", "small", "medium", "large", "xlarge"],
      justify: ["between", "start", "center", "end"],
      margin: Edge,
      rows: GridRows
    }
  },
  Stack: {
    component: Stack,
    name: "Stack",
    container: true,
    properties: {
      anchor: [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
      ],
      fill: false,
      guidingChild: ["first", "last"],
      margin: Edge
    }
  },
  Layer: {
    component: Layer,
    name: "Layer",
    container: true,
    defaultProps: {
      modal: false
    },
    properties: {
      animate: false,
      full: ["horizontal", "vertical"],
      margin: ["none", "xsmall", "small", "medium", "large"],
      plain: false,
      position: ["center", "top", "bottom", "left", "right"],
      responsive: false
    }
  },
  Grommet: { component: Grommet, name: "Grommet", container: true },
  Heading: {
    component: Heading,
    name: "Heading",
    text: "Heading",
    properties: {
      color: colors,
      level: ["1", "2", "3", "4"],
      margin: HeadingMargin,
      size: ["xsmall", "small", "medium", "large", "xlarge"],
      textAlign: ["start", "center", "end"],
      truncate: false
    }
  },
  Paragraph: {
    component: Paragraph,
    name: "Paragraph",
    text: "Paragraph",
    properties: {
      color: colors,
      margin: Edge,
      size: ["small", "medium", "large", "xlarge", "xxlarge"],
      textAlign: ["start", "center", "end"]
    }
  },
  Text: {
    component: Text,
    name: "Text",
    text: "Text",
    properties: {
      color: colors,
      margin: Edge,
      size: ["xsmall", "small", "medium", "large", "xlarge", "xxlarge"],
      textAlign: ["start", "center", "end"],
      truncate: false,
      weight: ["normal", "bold"]
    }
  },
  Markdown: {
    component: Markdown,
    name: "Markdown",
    text: "Markdown"
  },
  Icon: {
    component: Icon,
    name: "Icon",
    properties: {
      color: colors,
      icon: iconNames,
      size: ["small", "medium", "large"]
    }
  },
  Anchor: {
    component: Anchor,
    name: "Anchor",
    container: true,
    defaultProps: {
      label: "anchor"
    },
    properties: {
      color: colors,
      href: "",
      label: "anchor",
      margin: Edge,
      size: ["xsmall", "small", "medium", "large"]
    }
  },
  Button: {
    component: Button,
    name: "Button",
    container: true,
    defaultProps: {
      label: "Button"
    },
    properties: {
      color: colors,
      disabled: false,
      fill: ["horizontal", "vertical"],
      gap: ["xxsmall", "xsmall", "small", "medium", "large", "xlarge"],
      hoverIndicator: false,
      href: "",
      icon: iconNames,
      label: "Click Me",
      margin: Edge,
      plain: false,
      primary: false,
      reverse: false,
      type: ["button", "reset", "submit"]
    }
  },
  DropButton: {
    component: DropButton,
    name: "DropButton",
    container: true,
    help: `The dropContent of DropButton can be seen by setting the 'open'
    property to 'true', allowing you to populate the contents. You can then
    restore 'open' to 'undefined', so the button is interactive again.`,
    defaultProps: {
      label: "Drop Button"
    },
    properties: {
      color: colors,
      disabled: false,
      dropAlign: DropAlign,
      dropProps: {
        elevation: ["none", "xsmall", "small", "medium", "large", "xlarge"],
        plain: false,
        stretch: true
      },
      fill: ["horizontal", "vertical"],
      gap: ["xxsmall", "xsmall", "small", "medium", "large", "xlarge"],
      hoverIndicator: false,
      href: "",
      icon: iconNames,
      label: "Click Me",
      margin: Edge,
      open: [true, false],
      plain: false,
      primary: false,
      reverse: false
    }
  },
  Menu: {
    component: Menu,
    name: "Menu",
    defaultProps: {
      label: "Menu"
    },
    properties: {
      disabled: false,
      dropAlign: DropAlign,
      dropBackground: {
        color: colors,
        opacity: ["weak", "medium", "strong"]
      },
      icon: iconNames,
      items: MenuItems,
      label: "Actions",
      open: false,
      size: ["small", "medium", "large", "xlarge"]
    }
  },
  CheckBox: {
    component: CheckBox,
    name: "CheckBox",
    defaultProps: {
      label: "CheckBox"
    },
    properties: {
      checked: false,
      disabled: false,
      label: "enabled?",
      reverse: false,
      toggle: false
    }
  },
  Form: {
    component: Form,
    container: true,
    name: "Form"
  },
  FormField: {
    component: FormField,
    container: true,
    name: "FormField",
    properties: {
      color: colors,
      error: "error",
      help: "help",
      label: "label",
      name: "string"
    }
  },
  MaskedInput: {
    component: MaskedInput,
    name: "MaskedInput",
    properties: {
      mask: MaskedInputMask,
      plain: false,
      size: ["small", "medium", "large", "xlarge"],
      value: ""
    }
  },
  Select: {
    component: Select,
    name: "Select",
    defaultProps: {
      options: ["option 1", "option 2"]
    },
    properties: {
      closeOnChange: true,
      disabled: false,
      dropAlign: DropAlign,
      dropHeight: ["xsmall", "small", "medium", "large", "xlarge"],
      icon: iconNames,
      multiple: false,
      options: SelectOptions,
      placeholder: "",
      plain: false,
      searchPlaceholder: "",
      size: ["small", "medium", "large", "xlarge"],
      value: ""
    }
  },
  TextArea: {
    component: TextArea,
    name: "TextArea",
    properties: {
      fill: false,
      placeholder: "",
      plain: false,
      resize: ["vertical", "horizontal", true, false],
      size: ["small", "medium", "large", "xlarge"],
      value: TextAreaValue
    }
  },
  TextInput: {
    component: TextInput,
    name: "TextInput",
    properties: {
      placeholder: "",
      plain: false,
      size: ["small", "medium", "large", "xlarge"],
      suggestions: TextInputSuggestions,
      type: ["text", "password"],
      value: ""
    }
  },
  Calendar: {
    component: Calendar,
    name: "Calendar",
    properties: {
      animate: false,
      daysOfWeek: false,
      range: false,
      size: ["small", "medium", "large"]
    }
  },
  Chart: {
    component: Chart,
    name: "Chart",
    defaultProps: {
      type: "bar"
    },
    properties: {
      bounds: ChartBounds,
      color: colors,
      margin: Edge,
      overflow: false,
      round: false,
      size: ["xxsmall", "xsmall", "small", "medium", "large", "xlarge"],
      thickness: ["hair", "xsmall", "small", "medium", "large", "xlarge"],
      type: ["bar", "line", "area"],
      values: ChartValues
    }
  },
  Clock: {
    component: Clock,
    name: "Clock",
    properties: {
      hourLimit: ["12", "24"],
      precision: ["hours", "minutes", "seconds"],
      run: ["forward", "backward"],
      size: ["small", "medium", "large", "xlarge"],
      type: ["analog", "digital"]
    }
  },
  DataTable: {
    component: DataTable,
    name: "DataTable",
    defaultProps: {
      columns: [
        { header: "Name", property: "name", primary: true },
        { header: "Count", property: "count" }
      ],
      data: [{ name: "Eric", count: 5 }, { name: "Shimi", count: 7 }]
    },
    properties: {
      columns: DataTableColumns,
      data: DataTableData,
      resizeable: false,
      size: ["small", "medium", "large", "xlarge"],
      sortable: false
    }
  },
  Meter: {
    component: Meter,
    name: "Meter",
    properties: {
      background: colors,
      round: false,
      size: ["xsmall", "small", "medium", "large", "xlarge", "full"],
      thickness: ["xsmall", "small", "medium", "large", "xlarge"],
      type: ["bar", "circle"],
      values: MeterValues
    }
  },
  Image: {
    component: Image,
    name: "Image",
    properties: {
      fit: ["cover", "contain"],
      opacity: ["weak", "medium", "strong"],
      src: ImageSrc
    }
  },
  Video: {
    component: Video,
    name: "Video",
    properties: {
      autoPlay: false,
      controls: [false, "over", "below"],
      fit: ["cover", "contain"],
      loop: false,
      src: ""
    }
  },
  Repeater: {
    name: "Repeater",
    container: true,
    help: `Repeater is not a grommet component, it is a special component for
    use with this design tool. It expects a single child component which
    it will repeat 'count' times. Wrap it in a Box or Grid to control
    it's layout.`,
    defaultProps: {
      count: 2
    },
    properties: {
      count: [1, 2, 5, 10, 20, 100],
      dataPath: ""
    }
  },
  Reference: {
    component: Reference,
    name: "Reference",
    help: `Reference is not a grommet component, it is a special component for
    use with this design tool. It has a single property which is a reference
    to the component that should be used. Changes to that referenced component
    will be shown for all References to it.`,
    properties: {
      component: ReferenceComponent
    }
  },
  Screen: {
    name: "Screen",
    starters: [
      {
        name: "Splash",
        root: 2,
        components: {
          "2": {
            id: 2,
            type: "Grommet",
            props: {
              style: {
                height: "100vh"
              }
            },
            children: [4]
          },
          "4": {
            type: "Box",
            id: 4,
            props: {
              align: "center",
              justify: "center",
              pad: "small",
              fill: "vertical",
              background: {
                image:
                  "url('http://bgfons.com/uploads/drops/drops_texture523.jpg')"
              }
            },
            children: [5]
          },
          "5": {
            type: "Box",
            id: 5,
            props: {
              align: "center",
              justify: "center",
              pad: {
                horizontal: "xlarge",
                vertical: "large"
              },
              background: {
                color: "accent-1",
                opacity: "strong"
              },
              round: "medium",
              gap: "medium"
            },
            children: [6, 7]
          },
          "6": {
            type: "Heading",
            id: 6,
            props: {
              margin: "none"
            },
            text: "Hello "
          },
          "7": {
            type: "Icon",
            id: 7,
            props: {
              icon: "Favorite",
              size: "large",
              color: "brand"
            }
          }
        }
      },
      {
        name: "2Column",
        root: 36,
        components: {
          "36": {
            id: 36,
            type: "Grommet",
            props: {
              style: {
                height: "100vh"
              }
            },
            children: [37]
          },
          "37": {
            type: "Grid",
            id: 37,
            props: {
              fill: "vertical",
              columns: [["small", "medium"], ["medium", "flex"]]
            },
            children: [38, 47]
          },
          "38": {
            type: "Box",
            id: 38,
            props: {
              justify: "between",
              background: {
                color: "light-2"
              }
            },
            children: [39, 41, 45],
            name: "sidebar",
            collapsed: false
          },
          "39": {
            type: "Box",
            id: 39,
            props: {
              align: "center",
              justify: "between",
              pad: "small",
              direction: "row"
            },
            children: [40],
            name: "heading",
            collapsed: true
          },
          "40": {
            type: "Text",
            id: 40,
            props: {
              size: "large"
            },
            text: "App Name"
          },
          "41": {
            type: "Box",
            id: 41,
            props: {
              flex: true,
              overflow: "auto"
            },
            name: "menu",
            children: [42],
            collapsed: true
          },
          "42": {
            type: "Button",
            id: 42,
            props: {
              label: "",
              hoverIndicator: true
            },
            children: [43]
          },
          "43": {
            type: "Box",
            id: 43,
            props: {
              pad: {
                horizontal: "small",
                vertical: "xsmall"
              },
              direction: "row"
            },
            children: [44]
          },
          "44": {
            type: "Text",
            id: 44,
            props: {
              weight: "bold"
            },
            text: "section"
          },
          "45": {
            type: "Box",
            id: 45,
            props: {
              align: "center",
              justify: "between",
              direction: "row"
            },
            name: "footer",
            children: [46],
            collapsed: true
          },
          "46": {
            type: "Menu",
            id: 46,
            props: {
              label: "",
              icon: "User",
              items: [
                {
                  label: "Sign out"
                }
              ],
              dropAlign: {
                bottom: "top",
                left: "left"
              }
            }
          },
          "47": {
            type: "Box",
            id: 47,
            props: {},
            name: "main",
            children: [48, 51]
          },
          "48": {
            type: "Box",
            id: 48,
            props: {
              align: "center",
              pad: "small",
              direction: "row",
              justify: "between",
              flex: false
            },
            children: [49, 50],
            name: "header",
            collapsed: true
          },
          "49": {
            type: "Heading",
            id: 49,
            props: {
              margin: "none",
              size: "small"
            }
          },
          "50": {
            type: "Button",
            id: 50,
            props: {
              label: "Action",
              primary: true
            }
          },
          "51": {
            type: "Box",
            id: 51,
            props: {
              flex: true,
              overflow: "auto"
            },
            name: "content"
          }
        }
      },
      {
        name: "Marketing",
        root: 143,
        components: {
          "143": {
            id: 143,
            type: "Grommet",
            props: {
              style: {
                height: "100vh"
              }
            },
            children: [144]
          },
          "144": {
            type: "Box",
            id: 144,
            props: {
              styling: '{"minHeight": "100vh}',
              background: {
                color: "dark-1"
              },
              style: {
                minHeight: "100vh"
              },
              fill: "vertical",
              overflow: "auto"
            },
            children: [169, 152, 156, 165, 170]
          },
          "145": {
            type: "Box",
            id: 145,
            props: {
              align: "center",
              justify: "between",
              pad: "medium",
              flex: false,
              direction: "row",
              gridArea: "center"
            },
            children: [146, 149],
            name: "",
            collapsed: true
          },
          "146": {
            type: "Box",
            id: 146,
            props: {
              align: "center",
              direction: "row",
              gap: "medium"
            },
            children: [147, 148],
            collapsed: true
          },
          "147": {
            type: "Icon",
            id: 147,
            props: {
              icon: "Ad"
            }
          },
          "148": {
            type: "Text",
            id: 148,
            props: {
              size: "large"
            },
            text: "Title"
          },
          "149": {
            type: "Box",
            id: 149,
            props: {
              align: "center",
              direction: "row",
              gap: "small"
            },
            children: [150],
            name: "menu",
            collapsed: true
          },
          "150": {
            type: "Repeater",
            id: 150,
            props: {
              count: 2
            },
            children: [151]
          },
          "151": {
            type: "Anchor",
            id: 151,
            props: {
              label: "section",
              margin: "small"
            }
          },
          "152": {
            type: "Box",
            id: 152,
            props: {
              align: "center",
              justify: "center",
              pad: "medium",
              basis: "medium",
              flex: false,
              background: {
                image:
                  "url('http://www.textures.com/system/gallery/photos/Buildings/High Rise/Night/56310/HighRiseNight0077_600.jpg?v=4')"
              }
            },
            children: [153, 154, 155],
            name: "section",
            collapsed: true
          },
          "153": {
            type: "Heading",
            id: 153,
            props: {},
            text: "Section One"
          },
          "154": {
            type: "Paragraph",
            id: 154,
            props: {}
          },
          "155": {
            type: "Button",
            id: 155,
            props: {
              label: "Button"
            }
          },
          "156": {
            type: "Box",
            id: 156,
            props: {
              align: "center",
              justify: "center",
              pad: "medium",
              basis: "medium",
              flex: false,
              background: {
                image:
                  "url('http://www.textures.com/system/gallery/photos/Landscapes/City Night/112551/LandscapesCityNight0042_1_600.jpg?v=4')"
              }
            },
            children: [157, 158, 159],
            name: "section",
            collapsed: true
          },
          "157": {
            type: "Heading",
            id: 157,
            props: {},
            text: "Section Two"
          },
          "158": {
            type: "Paragraph",
            id: 158,
            props: {}
          },
          "159": {
            type: "Button",
            id: 159,
            props: {
              label: "Button"
            }
          },
          "160": {
            type: "Box",
            id: 160,
            props: {
              align: "center",
              justify: "between",
              pad: "medium",
              direction: "row",
              flex: false,
              gridArea: "center"
            },
            name: "",
            children: [161, 162],
            collapsed: true
          },
          "161": {
            type: "Text",
            id: 161,
            props: {},
            text: "© Copyright"
          },
          "162": {
            type: "Box",
            id: 162,
            props: {
              align: "center",
              direction: "row"
            },
            children: [163]
          },
          "163": {
            type: "Repeater",
            id: 163,
            props: {
              count: 2
            },
            children: [164]
          },
          "164": {
            type: "Anchor",
            id: 164,
            props: {
              label: "anchor",
              margin: "small"
            }
          },
          "165": {
            type: "Box",
            id: 165,
            props: {
              align: "center",
              justify: "center",
              pad: "medium",
              basis: "medium",
              flex: false,
              background: {
                image:
                  "url('http://www.textures.com/system/gallery/photos/Buildings/High Rise/Night/56329/HighRiseNight0086_600.jpg?v=5')"
              }
            },
            children: [166, 167, 168],
            name: "section",
            collapsed: true
          },
          "166": {
            type: "Heading",
            id: 166,
            props: {},
            text: "Section Three"
          },
          "167": {
            type: "Paragraph",
            id: 167,
            props: {}
          },
          "168": {
            type: "Button",
            id: 168,
            props: {
              label: "Button"
            }
          },
          "169": {
            type: "Grid",
            id: 169,
            props: {
              columns: ["flex", ["large", "xlarge"], "flex"],
              rows: ["auto"],
              areas: [
                {
                  name: "center",
                  start: [1, 0],
                  end: [1, 0]
                }
              ]
            },
            children: [145],
            name: "header",
            collapsed: true
          },
          "170": {
            type: "Grid",
            id: 170,
            props: {
              columns: ["flex", ["large", "xlarge"], "flex"],
              rows: ["auto"],
              areas: [
                {
                  name: "center",
                  start: [1, 0],
                  end: [1, 0]
                }
              ]
            },
            children: [160],
            name: "footer",
            collapsed: true
          }
        }
      }
    ]
  }
};
