export const bare = {
  screens: { 1: { id: 1, name: 'Screen', root: 2, path: '/' } },
  screenOrder: [1],
  components: {
    2: {
      id: 2,
      type: 'grommet.Box',
      props: {
        pad: 'large',
        fill: 'vertical',
        overflow: 'auto',
        align: 'center',
      },
    },
  },
  theme: 'grommet',
};
