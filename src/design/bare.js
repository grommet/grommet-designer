export const bare = {
  screens: { 1: { id: 1, name: 'Screen', root: 2, path: '/' } },
  screenOrder: [1],
  components: {
    2: {
      id: 2,
      type: 'grommet.Box',
      props: {
        fill: 'vertical',
        overflow: 'auto',
        align: 'center',
        flex: 'grow',
      },
    },
  },
  theme: 'grommet',
  imports: [],
  // state
  // local: whether this design exists in local storage
  // date: date this design was last updated
  // publishedUrl: where this design was published
  // modified: whether a published design has been modified since it was published
};
