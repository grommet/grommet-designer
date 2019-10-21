export const templates = {
  header: {
    name: 'header',
    root: 213,
    components: {
      '213': {
        type: 'Box',
        id: 213,
        props: {
          align: 'center',
          justify: 'between',
          direction: 'row',
          flex: false,
        },
      },
    },
  },
  list: {
    name: 'list',
    root: 4,
    components: {
      '4': {
        type: 'Box',
        id: 4,
        props: {},
        children: [5],
        name: 'list',
      },
      '5': {
        type: 'Repeater',
        id: 5,
        props: {
          count: 5,
        },
        children: [9],
      },
      '6': {
        type: 'Box',
        id: 6,
        props: {
          align: 'center',
          justify: 'between',
          pad: {
            horizontal: 'medium',
            vertical: 'small',
          },
          direction: 'row',
        },
        children: [7, 8],
      },
      '7': {
        type: 'Text',
        id: 7,
        props: {
          weight: 'bold',
        },
        text: 'name',
      },
      '8': {
        type: 'Text',
        id: 8,
        props: {},
        text: 'detail',
      },
      '9': {
        type: 'Button',
        id: 9,
        props: {
          hoverIndicator: true,
        },
        children: [6],
      },
    },
  },
  splash: {
    name: 'Splash',
    root: 2,
    components: {
      '2': {
        id: 2,
        type: 'Grommet',
        props: {
          style: {
            height: '100vh',
          },
        },
        children: [4],
      },
      '4': {
        type: 'Box',
        id: 4,
        props: {
          align: 'center',
          justify: 'center',
          pad: 'small',
          fill: 'vertical',
          background: {
            image:
              "url('http://bgfons.com/uploads/drops/drops_texture523.jpg')",
          },
        },
        children: [5],
      },
      '5': {
        type: 'Box',
        id: 5,
        props: {
          align: 'center',
          justify: 'center',
          pad: {
            horizontal: 'xlarge',
            vertical: 'large',
          },
          background: {
            color: 'accent-1',
            opacity: 'strong',
          },
          round: 'medium',
          gap: 'medium',
        },
        children: [6, 7],
      },
      '6': {
        type: 'Heading',
        id: 6,
        props: {
          margin: 'none',
        },
        text: 'Hello ',
      },
      '7': {
        type: 'Icon',
        id: 7,
        props: {
          icon: 'Favorite',
          size: 'large',
          color: 'brand',
        },
      },
    },
  },
  '2Column': {
    name: '2Column',
    root: 36,
    components: {
      '36': {
        id: 36,
        type: 'Grommet',
        props: {
          style: {
            height: '100vh',
          },
        },
        children: [37],
      },
      '37': {
        type: 'Grid',
        id: 37,
        props: {
          fill: 'vertical',
          columns: [['small', 'medium'], ['medium', 'flex']],
        },
        children: [38, 47],
      },
      '38': {
        type: 'Box',
        id: 38,
        props: {
          justify: 'between',
          background: {
            color: 'light-2',
          },
        },
        children: [39, 41, 45],
        name: 'sidebar',
        collapsed: false,
      },
      '39': {
        type: 'Box',
        id: 39,
        props: {
          align: 'center',
          justify: 'between',
          pad: 'small',
          direction: 'row',
        },
        children: [40],
        name: 'heading',
        collapsed: true,
      },
      '40': {
        type: 'Text',
        id: 40,
        props: {
          size: 'large',
        },
        text: 'App Name',
      },
      '41': {
        type: 'Box',
        id: 41,
        props: {
          flex: true,
          overflow: 'auto',
        },
        name: 'menu',
        children: [42],
        collapsed: true,
      },
      '42': {
        type: 'Button',
        id: 42,
        props: {
          label: '',
          hoverIndicator: true,
        },
        children: [43],
      },
      '43': {
        type: 'Box',
        id: 43,
        props: {
          pad: {
            horizontal: 'small',
            vertical: 'xsmall',
          },
          direction: 'row',
        },
        children: [44],
      },
      '44': {
        type: 'Text',
        id: 44,
        props: {
          weight: 'bold',
        },
        text: 'section',
      },
      '45': {
        type: 'Box',
        id: 45,
        props: {
          align: 'center',
          justify: 'between',
          direction: 'row',
        },
        name: 'footer',
        children: [46],
        collapsed: true,
      },
      '46': {
        type: 'Menu',
        id: 46,
        props: {
          label: '',
          icon: 'User',
          items: [
            {
              label: 'Sign out',
            },
          ],
          dropAlign: {
            bottom: 'top',
            left: 'left',
          },
        },
      },
      '47': {
        type: 'Box',
        id: 47,
        props: {},
        name: 'main',
        children: [48, 51],
      },
      '48': {
        type: 'Box',
        id: 48,
        props: {
          align: 'center',
          pad: 'small',
          direction: 'row',
          justify: 'between',
          flex: false,
        },
        children: [49, 50],
        name: 'header',
        collapsed: true,
      },
      '49': {
        type: 'Heading',
        id: 49,
        props: {
          margin: 'none',
          size: 'small',
        },
      },
      '50': {
        type: 'Button',
        id: 50,
        props: {
          label: 'Action',
          primary: true,
        },
      },
      '51': {
        type: 'Box',
        id: 51,
        props: {
          flex: true,
          overflow: 'auto',
        },
        name: 'content',
      },
    },
  },
  marketing: {
    name: 'Marketing',
    root: 143,
    components: {
      '143': {
        id: 143,
        type: 'Grommet',
        props: {
          style: {
            height: '100vh',
          },
        },
        children: [144],
      },
      '144': {
        type: 'Box',
        id: 144,
        props: {
          styling: '{"minHeight": "100vh}',
          background: {
            color: 'dark-1',
          },
          style: {
            minHeight: '100vh',
          },
          fill: 'vertical',
          overflow: 'auto',
        },
        children: [169, 152, 156, 165, 170],
      },
      '145': {
        type: 'Box',
        id: 145,
        props: {
          align: 'center',
          justify: 'between',
          pad: 'medium',
          flex: false,
          direction: 'row',
          gridArea: 'center',
        },
        children: [146, 149],
        name: '',
        collapsed: true,
      },
      '146': {
        type: 'Box',
        id: 146,
        props: {
          align: 'center',
          direction: 'row',
          gap: 'medium',
        },
        children: [147, 148],
        collapsed: true,
      },
      '147': {
        type: 'Icon',
        id: 147,
        props: {
          icon: 'Ad',
        },
      },
      '148': {
        type: 'Text',
        id: 148,
        props: {
          size: 'large',
        },
        text: 'Title',
      },
      '149': {
        type: 'Box',
        id: 149,
        props: {
          align: 'center',
          direction: 'row',
          gap: 'small',
        },
        children: [150],
        name: 'menu',
        collapsed: true,
      },
      '150': {
        type: 'Repeater',
        id: 150,
        props: {
          count: 2,
        },
        children: [151],
      },
      '151': {
        type: 'Anchor',
        id: 151,
        props: {
          label: 'section',
          margin: 'small',
        },
      },
      '152': {
        type: 'Box',
        id: 152,
        props: {
          align: 'center',
          justify: 'center',
          pad: 'medium',
          basis: 'medium',
          flex: false,
          background: {
            image:
              "url('http://www.textures.com/system/gallery/photos/Buildings/High Rise/Night/56310/HighRiseNight0077_600.jpg?v=4')",
          },
        },
        children: [153, 154, 155],
        name: 'section',
        collapsed: true,
      },
      '153': {
        type: 'Heading',
        id: 153,
        props: {},
        text: 'Section One',
      },
      '154': {
        type: 'Paragraph',
        id: 154,
        props: {},
      },
      '155': {
        type: 'Button',
        id: 155,
        props: {
          label: 'Button',
        },
      },
      '156': {
        type: 'Box',
        id: 156,
        props: {
          align: 'center',
          justify: 'center',
          pad: 'medium',
          basis: 'medium',
          flex: false,
          background: {
            image:
              "url('http://www.textures.com/system/gallery/photos/Landscapes/City Night/112551/LandscapesCityNight0042_1_600.jpg?v=4')",
          },
        },
        children: [157, 158, 159],
        name: 'section',
        collapsed: true,
      },
      '157': {
        type: 'Heading',
        id: 157,
        props: {},
        text: 'Section Two',
      },
      '158': {
        type: 'Paragraph',
        id: 158,
        props: {},
      },
      '159': {
        type: 'Button',
        id: 159,
        props: {
          label: 'Button',
        },
      },
      '160': {
        type: 'Box',
        id: 160,
        props: {
          align: 'center',
          justify: 'between',
          pad: 'medium',
          direction: 'row',
          flex: false,
          gridArea: 'center',
        },
        name: '',
        children: [161, 162],
        collapsed: true,
      },
      '161': {
        type: 'Text',
        id: 161,
        props: {},
        text: '© Copyright',
      },
      '162': {
        type: 'Box',
        id: 162,
        props: {
          align: 'center',
          direction: 'row',
        },
        children: [163],
      },
      '163': {
        type: 'Repeater',
        id: 163,
        props: {
          count: 2,
        },
        children: [164],
      },
      '164': {
        type: 'Anchor',
        id: 164,
        props: {
          label: 'anchor',
          margin: 'small',
        },
      },
      '165': {
        type: 'Box',
        id: 165,
        props: {
          align: 'center',
          justify: 'center',
          pad: 'medium',
          basis: 'medium',
          flex: false,
          background: {
            image:
              "url('http://www.textures.com/system/gallery/photos/Buildings/High Rise/Night/56329/HighRiseNight0086_600.jpg?v=5')",
          },
        },
        children: [166, 167, 168],
        name: 'section',
        collapsed: true,
      },
      '166': {
        type: 'Heading',
        id: 166,
        props: {},
        text: 'Section Three',
      },
      '167': {
        type: 'Paragraph',
        id: 167,
        props: {},
      },
      '168': {
        type: 'Button',
        id: 168,
        props: {
          label: 'Button',
        },
      },
      '169': {
        type: 'Grid',
        id: 169,
        props: {
          columns: ['flex', ['large', 'xlarge'], 'flex'],
          rows: ['auto'],
          areas: [
            {
              name: 'center',
              start: [1, 0],
              end: [1, 0],
            },
          ],
        },
        children: [145],
        name: 'header',
        collapsed: true,
      },
      '170': {
        type: 'Grid',
        id: 170,
        props: {
          columns: ['flex', ['large', 'xlarge'], 'flex'],
          rows: ['auto'],
          areas: [
            {
              name: 'center',
              start: [1, 0],
              end: [1, 0],
            },
          ],
        },
        children: [160],
        name: 'footer',
        collapsed: true,
      },
    },
  },
};
