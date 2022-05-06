/* eslint-disable no-undef */
import { Selector } from 'testcafe';

// https://github.com/DevExpress/testcafe/issues/6844
fixture('basic').page('http://localhost:3000');

const tagline = Selector('p').withText('design with grommet components');
const newControl = Selector('a').withAttribute(
  'title',
  'start a new design',
);
const designNameInput = Selector('input').withAttribute('name', 'name');
const designName = 'test design';
const createControl = Selector('button').withAttribute(
  'title',
  'create design',
);
const selectScreenTemplateLabel = Selector('label').withText('Select screen template');
const selectScreenControl = Selector('button').withAttribute(
  'title',
  'select screen template',
);
const empty = Selector('p').withText(
  'This PageContent is currently empty. Add some content to it.',
);


// const closeControl = Selector('button').withAttribute('title', 'close');
// const addControl = Selector('button').withAttribute('title', 'add a component');

test('initial', async (t) => {
  await t.expect(tagline.exists).ok();
});

test('create design', async (t) => {
  // const layerHeading = Selector('h2').withText('add');

  await t
    .expect(tagline.exists)
    .ok()
    .click(newControl)
    .expect(designNameInput.exists)
    .ok()
    .typeText(designNameInput, designName)
    .expect(createControl.exists)
    .ok()
    .click(createControl)
    .expect(selectScreenTemplateLabel.exists)
    .ok()
    .click(selectScreenControl)
    .expect(empty.exists)
    .ok()
    // .click(closeControl)
    // .expect(layerHeading.exists)
    // .notOk();
});

// test('add paragraph and undo', async (t) => {
//   const layerHeading = Selector('h2').withText('add');
//   const addParagraphControl = Selector('button').withText('Paragraph');
//   const nameInput = Selector('input').withAttribute('name', 'name');
//   const name = 'paragraph name';
//   const paragraphSelect = Selector('button').withText(name);
//   const textInput = Selector('textarea').withAttribute('name', 'text');
//   const text = 'paragraph text';
//   const paragraph = Selector('p').withText(text);
//   const undoControl = Selector('button').withAttribute(
//     'title',
//     'undo last change',
//   );

//   await t
//     .expect(tagline.exists)
//     .ok()
//     .click(createControl)
//     // changed to not show the design settings initially
//     // .expect(designNameInput.exists)
//     // .ok()
//     // .click(closeControl)
//     .expect(empty.exists)
//     .ok()
//     .click(addControl)
//     .expect(layerHeading.exists)
//     .ok()
//     .click(addParagraphControl)
//     .expect(layerHeading.exists)
//     .notOk()
//     .typeText(nameInput, name)
//     .expect(paragraphSelect.exists)
//     .ok()
//     .typeText(textInput, text)
//     .expect(paragraph.exists)
//     .ok()
//     .click(undoControl)
//     .expect(paragraph.exists)
//     .notOk();
// });
