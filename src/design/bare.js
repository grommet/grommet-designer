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
  // components: {
  //   2: {
  //     id: 2,
  //     type: 'grommet.Main',
  //     props: {
  //       fill: 'vertical',
  //       flex: 'grow',
  //       overflow: 'auto'
  //     },
  //     children: [3, 4, 5],
  //   },
  //   3: {
  //     id: 3,
  //     type: 'grommet.Header',
  //     props: {
  //       align: 'center',
  //       direction: 'row',
  //       flex: false,
  //       justify: 'between',
  //       gap: 'medium'
  //     },
  //   },
  //   4: {
  //     id: 4,
  //     type: 'grommet.Box',
  //     props: {
  //       align: 'center',
  //       justify: 'center',
  //       flex: 'grow',
  //     },
  //   },
  //   5: {
  //     id: 5,
  //     type: 'grommet.Footer',
  //     props: {
  //       align: 'center',
  //       direction: 'row',
  //       flex: false,
  //       justify: 'between',
  //       gap: 'medium'
  //     },
  //   },
  // },
  theme: 'grommet',
};
