/* eslint-disable no-undef */
import { Selector } from 'testcafe';

fixture('basic').page('http://localhost:3000');

test('initial', async t => {
  const empty = Selector('p').withText(
    'This Box is currently empty. Add components to it, so it can do its layout thing.',
  );
  await t.expect(empty.exists).ok();
});

test('open and close add', async t => {
  const openControl = Selector('button').withAttribute(
    'title',
    'add a component',
  );
  const layerHeading = Selector('h2').withText('add');
  const closeControl = Selector('button').withAttribute('title', 'close');

  await t
    .click(openControl)
    .expect(layerHeading.exists)
    .ok()
    .click(closeControl)
    .expect(layerHeading.exists)
    .notOk();
});

test('add paragraph and undo', async t => {
  const openControl = Selector('button').withAttribute(
    'title',
    'add a component',
  );
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
    .click(openControl)
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
