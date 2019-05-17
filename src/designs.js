
export const bare = [
  undefined, // leave id 0 undefined
  { id: 1, type: 'Grommet', props: { style: { height: '100vh' } } },
];

export const rich = [
  undefined,
  { id: 1, type: 'Grommet', props: { style: { height: '100vh'} }, children: [2] },
  { id: 2, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', fill: 'vertical', background: 'brand'}, children: [3,6,4] },
  { id: 3, type: 'Heading', props: { size: 'large', margin: 'none' }, text: 'Designer' },
  { id: 4, type: 'Box', props: { align: 'center', justify: 'between', pad: 'small', direction: 'row', alignSelf: 'stretch'}, children: [7,9] },
  { id: 5, type: 'Icon', props: { icon: 'LinkPrevious'} },
  { id: 6, type: 'Paragraph', props:{ size: 'xlarge' }, text: 'Design using real grommet components!'},
  { id: 7, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [5,8] },
  { id: 8, type: 'Text', props: {}, text: 'add components' },
  { id: 9, type: 'Box', props: { align: 'center', justify: 'center', pad: 'small', direction: 'row', gap: 'small' }, children: [10,11] },
  { id: 10, type: 'Text', props: {}, text: 'describe components' },
  { id: 11, type: 'Icon', props: { icon: 'LinkNext'} },
];
