/* eslint-disable no-undef */
import { Selector } from 'testcafe';

fixture('basic').page('http://localhost:3000');

test('initial', async t => {
  const empty = Selector('p').withText(
    'This Box is currently empty. Add components to it, so it can do its layout thing.',
  );
  await t.expect(empty.exists).ok();
});

// test('open Designs', async t => {
//   const control = Selector('button').withAttribute('title', 'add a component');
//   const layerHeading = Selector('h2').withText('add');
//   await t
//     .click(control)
//     .expect(layerHeading.exists).ok();
// });
