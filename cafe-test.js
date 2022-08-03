/* eslint-disable no-undef */
import { Selector, t } from 'testcafe';

// https://github.com/DevExpress/testcafe/issues/6844
fixture('basic').page('http://localhost:3000');

// generic button selectors
const textButton = (text) => Selector('button').withExactText(text);
const titleButton = (title) => Selector('button').withAttribute('title', title);
const labelButton = (label) =>
  Selector('button').withAttribute('aria-label', label);

// generic input selectors
const nameInput = (name) => Selector('input').withAttribute('name', name);
const placeholderInput = (placeholder) =>
  Selector('input').withAttribute('placeholder', placeholder);
const valueInput = (name, value) =>
  nameInput(name).withAttribute('value', value);

const typeSelect = (type) =>
  Selector('button')
    .withText(type)
    .withAttribute('aria-label', `Select ${type}`);
const typeMenu = (type) =>
  textButton(type).withAttribute('aria-label', 'Open Menu');

const select = async (type, index, name) => {
  let selector = typeSelect(name || type);
  if (index !== undefined) selector = selector.nth(index);
  await t.click(selector).expect(typeMenu(type).exists).ok();
};

const add = async (type, search) => {
  const addControl = titleButton('add a component');
  const typeAddControl = labelButton(`Add ${type}`);

  // open add layer
  await t.click(addControl).expect(typeAddControl.exists).ok();
  if (search) {
    const addSearchInput = placeholderInput('search ...');
    await t.typeText(addSearchInput, search).expect(typeAddControl.exists).ok();
  }
  // add type
  await t.click(typeAddControl).expect(typeMenu(type).exists).ok();
};

const newControl = Selector('a').withAttribute('title', 'start a new design');

const designName = 'test design';
const createDesignControl = textButton('Create Design');
const useScreenControl = textButton('Use Template');
const empty = Selector('p').withExactText(
  'This PageContent is currently empty. Add some content to it.',
);
const undoControl = titleButton('undo last change');
const redoControl = titleButton('redo last change');

const pageTitle = Selector('h1').withExactText('Test Page');
const closeLayerControl = textButton('Close Layer');
const openLayerControl = textButton('Open Layer');
const linkLabel = Selector('label').withExactText('link');
const testLayerOption = textButton('test layer').withAttribute(
  'role',
  'option',
);
const testAlternativeOption = textButton('test alternative').withAttribute(
  'role',
  'option',
);
const addActionsControl = labelButton('Add actions');
const backPageHeaderControl = textButton('back to Test Page');
const secondScreenControl = textButton('Second Screen');
const firstScreenLink = Selector('a').withExactText('First Screen Link');
const firstScreenOption = textButton('Test Screen').withAttribute(
  'role',
  'option',
);
// const secondScreenLink = Selector('a').withExactText('Second Screen Link');
const addDataControl = labelButton('add a data source');
const dataControl = textButton('data');
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
  await t.click(newControl).expect(nameInput('name').exists).ok();
  // give it a name
  await t
    .typeText(nameInput('name'), designName)
    .expect(createDesignControl.exists)
    .ok();
  // NewScreen
  await t.click(createDesignControl).expect(useScreenControl.exists).ok();
  // select a blank screen
  await t.click(useScreenControl).expect(empty.exists).ok();

  // rename screen
  await select('Screen');
  await t
    .typeText(nameInput('name'), 'Test Screen', { replace: true })
    .expect(textButton('Test Screen').exists)
    .ok();

  // add a PageHeader and give it a title

  await select('PageContent');
  await add('PageHeader', 'Page');
  await t
    .typeText(nameInput('title'), 'Test Page')
    .expect(pageTitle.exists)
    .ok();

  // add a Layer with a Button that will close it

  await select('PageContent');
  await add('Layer');
  await t.typeText(nameInput('name'), 'test layer');
  await add('Button');
  // set button label
  await t
    .typeText(nameInput('label'), 'Close Layer', { replace: true })
    .expect(closeLayerControl.exists)
    .ok();
  // set button link
  await t.click(linkLabel).expect(testLayerOption.exists).ok();
  await t.click(testLayerOption).expect(testLayerOption.exists).notOk();

  // close the Layer
  await t.click(closeLayerControl).expect(closeLayerControl.exists).notOk();

  // add actions to the PageHeader to open the layer
  // tests property component editing

  await select('PageHeader', undefined, 'Test Page');
  // add actions
  await t.click(addActionsControl).expect(backPageHeaderControl.exists).ok();
  await add('Button');
  await t
    .typeText(nameInput('label'), 'Open Layer', { replace: true })
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
  await t.click(openLayerControl).expect(closeLayerControl.exists).ok();

  // close the Layer
  await t.click(closeLayerControl).expect(closeLayerControl.exists).notOk();

  // add an Alternative and link to it with two buttons inside
  await select('PageContent');
  await add('Alternative');
  await t.typeText(nameInput('name'), 'test alternative');
  // first Button
  await add('Button');
  await t
    .typeText(nameInput('label'), 'First', { replace: true })
    .expect(textButton('First').exists)
    .ok();
  // set button link to alternative
  await t.click(linkLabel).expect(testAlternativeOption.exists).ok();
  await t
    .click(testAlternativeOption)
    .expect(testAlternativeOption.exists)
    .notOk();
  // second Button
  await select('Alternative', undefined, 'test alternative');
  await add('Button');
  await t
    .typeText(nameInput('label'), 'Second', { replace: true })
    .expect(Selector('button').withText('Second').exists) // not in canvas
    .ok();
  // set button link to alternative
  await t.click(linkLabel).expect(testAlternativeOption.exists).ok();
  await t
    .click(testAlternativeOption)
    .expect(testAlternativeOption.exists)
    .notOk();
  // click First
  await t.click(textButton('First')).expect(textButton('Second').exists).ok();
  // click Second
  await t.click(textButton('Second')).expect(textButton('First').exists).ok();

  // add a screen with a link to the first screen

  await add('Screen');
  // set screen name
  await t
    .typeText(nameInput('name'), 'Second Screen', { replace: true })
    .expect(secondScreenControl.exists)
    .ok();
  // select simple page screen template
  await t.click(useScreenControl).expect(empty.exists).ok();
  // select the second screen's PageContent
  await select('PageContent', 1);
  await add('Anchor');
  // set anchor label
  await t
    .typeText(nameInput('label'), 'First Screen Link', { replace: true })
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
  // TODO: the following isn't working, seems like TestCafe isn't sending
  // the 'shift' modifier
  // // with shift key, shouldn't navigate
  // await t
  //   .click(firstScreenLink, { modifiers: { shift: true } })
  //   .expect(pageTitle.exists)
  //   .notOk();
  // without shift, should navigate
  await t.click(firstScreenLink).expect(pageTitle.exists).ok();

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
    .typeText(nameInput('dataPath'), 'data', { replace: true })
    .expect(alphaTableHeader.exists)
    .ok();

  // close design
  await t.click(textButton(designName)).expect(textButton('close').exists).ok();
  await t.click(textButton('close')).expect(newControl.exists).ok();
  await t.expect(Selector('a').withText(designName).exists).ok();

  // create another design

  // NewDesign
  await t.click(newControl).expect(nameInput('name').exists).ok();
  // give it a name
  await t
    .typeText(nameInput('name'), 'Second Design')
    .expect(valueInput('name', 'Second Design').exists)
    .ok();
  // include the first test design
  await t
    .click(nameInput('includes'))
    .expect(textButton(designName).exists)
    .ok();
  await t
    .click(textButton(designName))
    .expect(valueInput('includes', designName).exists)
    .ok();
  await t.click(createDesignControl).expect(useScreenControl.exists).ok();

  // NewScreen
  // select included screen
  const testScreenButton = Selector('button')
    .withText('Test Screen')
    .withText(designName);
  await t
    .click(Selector('label').withExactText('screen template'))
    .expect(testScreenButton.exists)
    .ok();
  await t.click(testScreenButton).expect(testScreenButton.exists).ok();
  await t.click(useScreenControl).expect(openLayerControl.exists).ok();

  // delete design

  await t
    .click(textButton('Second Design'))
    .expect(textButton('delete ...').exists)
    .ok();
  await t
    .click(textButton('delete ...'))
    .expect(textButton('Yes, delete').exists)
    .ok();
  await t.wait(500);
  await t.click(textButton('Yes, delete')).expect(newControl.exists).ok();
  await t.expect(Selector('a').withExactText('Second Design').exists).notOk();
  await t.expect(Selector('a').withText(designName).exists).ok();

  // duplicate design

  // NewDesign
  await t.click(newControl).expect(nameInput('name').exists).ok();
  // give it a name
  await t
    .typeText(nameInput('name'), 'Third Design')
    .expect(valueInput('name', 'Third Design').exists)
    .ok();
  // choose dplicate existing
  await t
    .click(Selector('label').withExactText('duplicate an existing design'))
    .expect(nameInput('template').exists)
    .ok();
  await t
    .click(nameInput('template'))
    .expect(textButton(designName).exists)
    .ok();
  await t
    .click(textButton(designName))
    .expect(valueInput('template', designName).exists)
    .ok();
  await t
    .click(titleButton('duplicate design'))
    .expect(textButton('Test Screen').exists)
    .ok();

  await t.wait(1000);
});
