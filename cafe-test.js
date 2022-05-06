/* eslint-disable no-undef */
import { Selector } from 'testcafe';

// https://github.com/DevExpress/testcafe/issues/6844
fixture('basic').page('http://localhost:3000');

// const tagline = Selector('p').withText('design with grommet components');
const newControl = Selector('a').withAttribute('title', 'start a new design');
const nameInput = Selector('input').withAttribute('name', 'name');
const titleInput = Selector('input').withAttribute('name', 'title');
const designName = 'test design';
const createControl = Selector('button').withAttribute(
  'title',
  'create design',
);
const selectScreenControl = Selector('button').withAttribute(
  'title',
  'select screen template',
);
const empty = Selector('p').withExactText(
  'This PageContent is currently empty. Add some content to it.',
);
const pageContentControl = Selector('button').withExactText('PageContent');
const pageContentMenu = pageContentControl.withAttribute(
  'aria-label',
  'Open Menu',
);
const addControl = Selector('button').withAttribute('title', 'add a component');
// const addLayerHeading = Selector('h2').withText('add');
const addSearchInput = Selector('input').withAttribute(
  'placeholder',
  'search ...',
);
const pageHeaderControl = Selector('button').withExactText('PageHeader');
const pageHeaderMenu = pageHeaderControl.withAttribute(
  'aria-label',
  'Open Menu',
);
const pageTitle = Selector('h1').withExactText('Page Title');
const closeControl = Selector('button').withAttribute('title', 'close');

// const closeControl = Selector('button').withAttribute('title', 'close');
// const addControl = Selector('button').withAttribute('title', 'add a component');

// test('initial', async (t) => {
//   await t.expect(tagline.exists).ok();
// });

test('create design', async (t) => {
  await t
    // from the Start
    .expect(newControl.exists)
    .ok()
    .click(newControl)
    // NewDesign
    .expect(nameInput.exists)
    .ok()
    .typeText(nameInput, designName)
    .expect(createControl.exists)
    .ok()
    .click(createControl)
    // NewScreen
    .expect(selectScreenControl.exists)
    .ok()
    .click(selectScreenControl)
    .expect(empty.exists)
    .ok()
    // select PageContent
    .click(pageContentControl)
    .expect(pageContentMenu.exists)
    .ok()
    // add PageHeader
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()

    .typeText(addSearchInput, 'Pag')
    .expect(pageHeaderControl.exists)
    .ok()
    .click(pageHeaderControl)
    .expect(pageHeaderMenu.exists)
    .ok()
    .typeText(titleInput, 'Test Page')
    .expect(pageTitle.exists)
    .ok();

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
