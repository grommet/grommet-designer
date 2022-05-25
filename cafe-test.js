/* eslint-disable no-undef */
import { Selector, t } from 'testcafe';

// https://github.com/DevExpress/testcafe/issues/6844
fixture('basic').page('http://localhost:3000');

const typeButton = (type) => Selector('button').withExactText(type);
const typeSelect = (type) =>
  typeButton(type).withAttribute('aria-label', `Select ${type}`);
const typeMenu = (type) =>
  typeButton(type).withAttribute('aria-label', 'Open Menu');

const select = async (type, index) => {
  let selector = typeSelect(type);
  if (index !== undefined) selector = selector.nth(index);
  await t.click(selector).expect(typeMenu(type).exists).ok();
};

const add = async (type, search) => {
  const addControl = Selector('button').withAttribute(
    'title',
    'add a component',
  );
  const typeAddControl = typeButton(type).withAttribute(
    'aria-label',
    `Add ${type}`,
  );

  // open add layer
  await t.click(addControl).expect(typeAddControl.exists).ok();
  if (search) {
    const addSearchInput = Selector('input').withAttribute(
      'placeholder',
      'search ...',
    );
    await t.typeText(addSearchInput, search).expect(typeAddControl.exists).ok();
  }
  // add type
  await t.click(typeAddControl).expect(typeMenu(type).exists).ok();
};

const newControl = Selector('a').withAttribute('title', 'start a new design');
const nameInput = Selector('input').withAttribute('name', 'name');
const titleInput = Selector('input').withAttribute('name', 'title');
const labelInput = Selector('input').withAttribute('name', 'label');
const dataPathInput = Selector('input').withAttribute('name', 'dataPath');
const designName = 'test design';
const createControl = Selector('button').withAttribute(
  'title',
  'create design',
);
const selectScreenControl = Selector('button').withAttribute(
  'title',
  'Use selected screen template',
);
const empty = Selector('p').withExactText(
  'This PageContent is currently empty. Add some content to it.',
);
const undoControl = Selector('button').withAttribute(
  'title',
  'undo last change',
);
const redoControl = Selector('button').withAttribute(
  'title',
  'redo last change',
);

const pageTitle = Selector('h1').withExactText('Test Page');
const closeLayerControl = Selector('button').withExactText('Close Layer');
const openLayerControl = Selector('button').withExactText('Open Layer');
const linkLabel = Selector('label').withExactText('link');
const testLayerOption = Selector('button')
  .withAttribute('role', 'option')
  .withExactText('test layer');
const addActionsControl = Selector('button').withAttribute(
  'aria-label',
  'Add actions',
);
const backPageHeaderControl =
  Selector('button').withExactText('back to PageHeader');
const secondScreenControl = Selector('button').withExactText('Second Screen');
const firstScreenLink = Selector('a').withExactText('First Screen Link');
const firstScreenOption = Selector('button')
  .withAttribute('role', 'option')
  .withExactText('Screen');
// const secondScreenLink = Selector('a').withExactText('Second Screen Link');
const addDataControl = Selector('button').withAttribute(
  'aria-label',
  'add a data source',
);
const dataControl = Selector('button').withExactText('data');
const dataSelectControl = dataControl.withAttribute(
  'aria-label',
  'Select data',
);
const dataArea = Selector('textarea').withAttribute('name', 'data');
const alphaTableHeader = Selector('th').withExactText('alpha');

// const closeControl = Selector('button').withAttribute('title', 'close');

test('create design', async (t) => {
  // from the Start
  await t.expect(newControl.exists).ok();
  // NewDesign
  await t.click(newControl).expect(nameInput.exists).ok();
  // give it a name
  await t.typeText(nameInput, designName).expect(createControl.exists).ok();
  // NewScreen
  await t.click(createControl).expect(selectScreenControl.exists).ok();
  // select a blank screen
  await t.click(selectScreenControl).expect(empty.exists).ok();

  // add a PageHeader and give it a title

  await select('PageContent');
  await add('PageHeader', 'Page');
  await t.typeText(titleInput, 'Test Page').expect(pageTitle.exists).ok();

  // add a Layer with a Button that will close it

  await select('PageContent');
  await add('Layer');
  await t.typeText(nameInput, 'test layer');
  await add('Button');
  // set button label
  await t
    .typeText(labelInput, 'Close Layer', { replace: true })
    .expect(closeLayerControl.exists)
    .ok();
  // set button link
  await t.click(linkLabel).expect(testLayerOption.exists).ok();
  await t.click(testLayerOption).expect(testLayerOption.exists).notOk();

  // close the Layer
  await t
    .click(closeLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .notOk();

  // add actions to the PageHeader to open the layer

  await select('PageHeader');
  // add actions
  await t.click(addActionsControl).expect(backPageHeaderControl.exists).ok();
  await add('Button');
  await t
    .typeText(labelInput, 'Open Layer', { replace: true })
    .expect(openLayerControl.exists)
    .ok();
  // set button link
  await t.click(linkLabel).expect(testLayerOption.exists).ok();
  await t.click(testLayerOption).expect(testLayerOption.exists).notOk();
  // done with PageHeader actions
  await t
    .click(backPageHeaderControl)
    .expect(backPageHeaderControl.exists)
    .notOk();

  // open the Layer
  await t
    .click(openLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .ok();

  // close the Layer
  await t
    .click(closeLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .notOk();

  // add a screen with a link to the first screen

  await add('Screen');
  // set screen name
  await t
    .typeText(nameInput, 'Second Screen', { replace: true })
    .expect(secondScreenControl.exists)
    .ok();
  // select simple page screen template
  await t.click(selectScreenControl).expect(empty.exists).ok();
  // select the second screen's PageContent
  await select('PageContent', 1);
  await add('Anchor');
  // set anchor label
  await t
    .typeText(labelInput, 'First Screen Link', { replace: true })
    .expect(firstScreenLink.exists)
    .ok();
  // undo
  await t.click(undoControl).expect(firstScreenLink.exists).notOk();
  // redo
  await t.click(redoControl).expect(firstScreenLink.exists).ok();
  // set anchor link
  await t.click(linkLabel).expect(firstScreenOption.exists).ok();
  await t.click(firstScreenOption).expect(firstScreenOption.exists).notOk();

  // follow link to first screen
  // without shift key, shouldn't navigate
  await t.click(firstScreenLink).expect(pageTitle.exists).notOk();
  // TODO: the following isn't working, seems like TestCafe isn't sending
  // the 'shift' modifier
  // // with shift, should navigate
  // await t.click(firstScreenLink, { modifiers: { shift: true } })
  // .expect(pageTitle.exists)
  // .ok();

  // add data
  // add
  await t.click(addDataControl).expect(dataSelectControl.exists).ok();
  await t.expect(dataArea.exists).ok();
  // type data
  await t
    .typeText(dataArea, '[{"name": "alpha"},{"name": "beta"}]', {
      replace: true,
    })
    .expect(dataSelectControl.exists)
    .ok();
  // select first screen's PageContent
  await select('PageContent', 0);
  await add('DataTable');
  // set dataPath to data
  await t
    .typeText(dataPathInput, 'data', { replace: true })
    .expect(alphaTableHeader.exists)
    .ok()

    .wait(2000);
});
