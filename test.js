/* eslint-disable no-undef */
import { Selector } from 'testcafe';

fixture('basic').page('http://localhost:3000');

const tagline = Selector('p').withText('design with grommet components');
const createControl = Selector('button').withAttribute(
  'title',
  'create a new design',
);
const empty = Selector('p').withText(
  'This Box is currently empty. Add components to it, so it can do its layout thing.',
);
const addControl = Selector('button').withAttribute('title', 'add a component');

test('initial', async t => {
  await t.expect(tagline.exists).ok();
});

test('create design', async t => {
  const layerHeading = Selector('h2').withText('add');
  const closeControl = Selector('button').withAttribute('title', 'close');

  await t
    .expect(tagline.exists)
    .ok()
    .click(createControl)
    .expect(empty.exists)
    .ok()
    .click(addControl)
    .expect(layerHeading.exists)
    .ok()
    .click(closeControl)
    .expect(layerHeading.exists)
    .notOk();
});

test('add paragraph and undo', async t => {
  const layerHeading = Selector('h2').withText('add');
  const addParagraphControl = Selector('button').withText('Paragraph');
  const nameInput = Selector('input').withAttribute('name', 'name');
  const name = 'paragraph name';
  const paragraphSelect = Selector('button').withText(name);
  const textInput = Selector('textarea').withAttribute('name', 'text');
  const text = 'paragraph text';
  const paragraph = Selector('p').withText(text);
  const undoControl = Selector('button').withAttribute(
    'title',
    'undo last change',
  );

  await t
    .expect(tagline.exists)
    .ok()
    .click(createControl)
    .expect(empty.exists)
    .ok()
    .click(addControl)
    .expect(layerHeading.exists)
    .ok()
    .click(addParagraphControl)
    .expect(layerHeading.exists)
    .notOk()
    .typeText(nameInput, name)
    .expect(paragraphSelect.exists)
    .ok()
    .typeText(textInput, text)
    .expect(paragraph.exists)
    .ok()
    .click(undoControl)
    .expect(paragraph.exists)
    .notOk();
});
