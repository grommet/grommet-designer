
export const bare = {
  screens: { 1: { id: 1, root: 2 } },
  screenOrder: [1],
  components: {
    2: { id: 2, type: 'Grommet', props: { style: { height: '100vh' } }, children: [ 3 ] },
    3: { id: 3, type: 'Heading', props: { textAlign: 'center' }, text: 'blank page' },
  },
  theme: 'grommet',
};
