export const bare = {
  screens: { 1: { id: 1, name: 'Screen', root: 2, path: '/' } },
  screenOrder: [1],
  components: {
    2: {
      id: 2,
      type: 'Grommet',
      props: { style: { height: '100vh' } },
      children: [3],
      deletable: false,
    },
    3: {
      id: 3,
      type: 'grommet.Heading',
      props: { textAlign: 'center' },
      text: 'blank page',
    },
  },
  theme: 'grommet',
};
