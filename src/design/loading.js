export const loading = {
  screens: {
    '1': {
      id: 1,
      root: 2,
      name: 'Loading',
    },
  },
  screenOrder: [1],
  components: {
    '2': {
      id: 2,
      type: 'Grommet',
      props: {
        style: {
          height: '100vh',
        },
      },
      children: [3],
    },
    '3': {
      type: 'grommet.Box',
      id: 3,
      props: {
        align: 'center',
        justify: 'center',
        pad: 'small',
        fill: 'vertical',
      },
      children: [5],
    },
    '4': {
      type: 'grommet.Text',
      id: 4,
      props: {
        size: 'xlarge',
        weight: 'bold',
        color: 'dark-4',
      },
      text: 'Loading ...',
    },
    '5': {
      type: 'grommet.Box',
      id: 5,
      props: {
        align: 'center',
        justify: 'center',
        pad: 'small',
        animation: 'pulse',
      },
      children: [4],
    },
  },
  name: 'loading',
  nextId: 6,
  version: 2,
  created: '2019-06-27T16:20:54.003Z',
};
