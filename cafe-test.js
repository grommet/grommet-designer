/* eslint-disable no-undef */
import { Selector } from 'testcafe';

// https://github.com/DevExpress/testcafe/issues/6844
fixture('basic').page('http://localhost:3000');

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
  'select screen template',
);
const empty = Selector('p').withExactText(
  'This PageContent is currently empty. Add some content to it.',
);
const pageContentControl = Selector('button').withExactText('PageContent');
const pageContentSelectControl = pageContentControl.withAttribute(
  'aria-label',
  'Select PageContent',
);
const pageContentMenu = pageContentControl.withAttribute(
  'aria-label',
  'Open Menu',
);
const addControl = Selector('button').withAttribute('title', 'add a component');
const addSearchInput = Selector('input').withAttribute(
  'placeholder',
  'search ...',
);
const undoControl = Selector('button').withAttribute(
  'title',
  'undo last change',
);
const redoControl = Selector('button').withAttribute(
  'title',
  'redo last change',
);

const pageHeaderControl = Selector('button').withExactText('PageHeader');
const pageHeaderSelectControl = pageHeaderControl.withAttribute(
  'aria-label',
  'Select PageHeader',
);
const pageHeaderAddControl = pageHeaderControl.withAttribute(
  'aria-label',
  'Add PageHeader',
);
const pageHeaderMenu = pageHeaderControl.withAttribute(
  'aria-label',
  'Open Menu',
);
const pageTitle = Selector('h1').withExactText('Test Page');
const layerControl = Selector('button').withExactText('Layer');
const layerAddControl = layerControl.withAttribute('aria-label', 'Add Layer');
const layerMenu = layerControl.withAttribute('aria-label', 'Open Menu');
const buttonControl = Selector('button').withExactText('Button');
const buttonAddControl = buttonControl.withAttribute(
  'aria-label',
  'Add Button',
);
const buttonMenu = buttonControl.withAttribute('aria-label', 'Open Menu');
const closeLayerControl = Selector('button').withExactText('Close Layer');
const openLayerControl = Selector('button').withExactText('Open Layer');
const linkLabel = Selector('label').withExactText('link');
const testLayerOption = Selector('button')
  .withAttribute('role', 'option')
  .withExactText('test layer');
const pageHeaderAddActionsControl = Selector('button').withAttribute(
  'aria-label',
  'Add actions',
);
const backPageHeaderControl =
  Selector('button').withExactText('back to PageHeader');
const screenControl = Selector('button').withExactText('Screen');
const screenAddControl = screenControl.withAttribute(
  'aria-label',
  'Add Screen',
);
const screenMenu = screenControl.withAttribute('aria-label', 'Open Menu');
const secondScreenControl = Selector('button').withExactText('Second Screen');
const anchorControl = Selector('button').withExactText('Anchor');
const anchorAddControl = anchorControl.withAttribute(
  'aria-label',
  'Add Anchor',
);
const anchorMenu = anchorControl.withAttribute('aria-label', 'Open Menu');
const firstScreenLink = Selector('a').withExactText('First Screen Link');
const firstScreenOption = Selector('button')
  .withAttribute('role', 'option')
  .withExactText('Screen');
const secondScreenLink = Selector('a').withExactText('Second Screen Link');
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
const dataTableControl = Selector('button').withExactText('DataTable');
const dataTableAddControl = dataTableControl.withAttribute(
  'aria-label',
  'Add DataTable',
);
const dataTableMenu = dataTableControl.withAttribute('aria-label', 'Open Menu');
const alphaTableHeader = Selector('th').withExactText('alpha');

// const closeControl = Selector('button').withAttribute('title', 'close');

test('create design', async (t) => {
  await t
    // from the Start
    .expect(newControl.exists)
    .ok()
    .click(newControl)
    // NewDesign
    .expect(nameInput.exists)
    .ok()
    // give it a name
    .typeText(nameInput, designName)
    .expect(createControl.exists)
    .ok()
    .click(createControl)
    // NewScreen
    .expect(selectScreenControl.exists)
    .ok()
    // select a blank screen
    .click(selectScreenControl)
    .expect(empty.exists)
    .ok()

    // add a PageHeader and give it a title

    // select PageContent
    .click(pageContentSelectControl)
    .expect(pageContentMenu.exists)
    .ok()
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // search to narrow choices
    .typeText(addSearchInput, 'page')
    .expect(pageHeaderAddControl.exists)
    .ok()
    // add PageHeader
    .click(pageHeaderAddControl)
    .expect(pageHeaderMenu.exists)
    .ok()
    // set page title
    .typeText(titleInput, 'Test Page')
    .expect(pageTitle.exists)
    .ok()

    // add a Layer with a Button that will close it

    // select PageContent
    .click(pageContentSelectControl)
    .expect(pageContentMenu.exists)
    .ok()
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // add Layer
    .click(layerAddControl)
    .expect(layerMenu.exists)
    .ok()
    // set layer name
    .typeText(nameInput, 'test layer')
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // add Button
    .click(buttonAddControl)
    .expect(buttonMenu.exists)
    .ok()
    // set button label
    .typeText(labelInput, 'Close Layer', { replace: true })
    .expect(closeLayerControl.exists)
    .ok()
    // set button link
    .click(linkLabel)
    .expect(testLayerOption.exists)
    .ok()
    .click(testLayerOption)
    .expect(testLayerOption.exists)
    .notOk()

    // close the Layer
    .click(closeLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .notOk()

    // add actions to the PageHeader to open the layer

    // select PageHeader
    .click(pageHeaderSelectControl)
    .expect(pageHeaderMenu.exists)
    .ok()
    // add actions
    .click(pageHeaderAddActionsControl)
    .expect(backPageHeaderControl.exists)
    .ok()
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // add Button
    .click(buttonAddControl)
    .expect(buttonMenu.exists)
    .ok()
    // set button label
    .typeText(labelInput, 'Open Layer', { replace: true })
    .expect(openLayerControl.exists)
    .ok()
    // set button link
    .click(linkLabel)
    .expect(testLayerOption.exists)
    .ok()
    .click(testLayerOption)
    .expect(testLayerOption.exists)
    .notOk()
    .click(backPageHeaderControl)
    .expect(backPageHeaderControl.exists)
    .notOk()

    // open the Layer
    .click(openLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .ok()

    // close the Layer
    .click(closeLayerControl, { modifiers: { shift: true } })
    .expect(closeLayerControl.exists)
    .notOk()

    // add a screen with a link to the first screen

    // add
    .click(addControl)
    .expect(screenAddControl.exists)
    .ok()
    // add Screen
    .click(screenAddControl)
    .expect(screenMenu.exists)
    .ok()
    // set screen name
    .typeText(nameInput, 'Second Screen', { replace: true })
    .expect(secondScreenControl.exists)
    .ok()
    // select simple page screen template
    .click(selectScreenControl)
    .expect(empty.exists)
    .ok()
    // select the second screen's PageContent
    .click(pageContentSelectControl.nth(1))
    .expect(pageContentMenu.exists)
    .ok()
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // add Anchor
    .click(anchorAddControl)
    .expect(anchorMenu.exists)
    .ok()
    // set anchor label
    .typeText(labelInput, 'First Screen Link', { replace: true })
    .expect(firstScreenLink.exists)
    .ok()
    // undo
    .click(undoControl)
    .expect(firstScreenLink.exists)
    .notOk()
    // redo
    .click(redoControl)
    .expect(firstScreenLink.exists)
    .ok()
    // set anchor link
    .click(linkLabel)
    .expect(firstScreenOption.exists)
    .ok()
    .click(firstScreenOption)
    .expect(firstScreenOption.exists)
    .notOk()

    // follow link to first screen
    // without shift key, shouldn't navigate
    .click(firstScreenLink)
    .expect(pageTitle.exists)
    .notOk()
    // TODO: the following isn't working, seems like TestCafe isn't sending
    // the 'shift' modifier
    // // with shift, should navigate
    // .click(firstScreenLink, { modifiers: { shift: true } })
    // .expect(pageTitle.exists)
    // .ok()

    // add data
    // add
    .click(addDataControl)
    .expect(dataSelectControl.exists)
    .ok()
    .expect(dataArea.exists)
    .ok()
    // type data
    .typeText(dataArea, '[{"name": "alpha"},{"name": "beta"}]', {
      replace: true,
    })
    .expect(dataSelectControl.exists)
    .ok()
    // select PageContent
    .click(pageContentSelectControl.nth(0))
    .expect(pageContentMenu.exists)
    .ok()
    // add
    // add
    .click(addControl)
    .expect(addSearchInput.exists)
    .ok()
    // add DataTable
    .click(dataTableAddControl)
    .expect(dataTableMenu.exists)
    .ok()
    // set dataPath to data
    .typeText(dataPathInput, 'data', { replace: true })
    .expect(alphaTableHeader.exists)
    .ok()

    .wait(2000);
});
