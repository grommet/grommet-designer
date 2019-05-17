import React, { Component } from 'react';
import {
  Box, Button, Grommet, Grid, Heading, ResponsiveContext, Text, dark, grommet,
} from 'grommet';
import { Add, Share, Trash } from 'grommet-icons';
import { dxc } from 'grommet-theme-dxc';
import { hpe } from 'grommet-theme-hpe';
import LZString from 'lz-string';
import { types, Adder } from './Types';
import Properties from './Properties';

const themes = { dark, dxc, hpe, grommet };

const bare = [
  undefined, // leave id 0 undefined
  { id: 1, type: 'Grommet', props: { style: { height: '100vh' } } },
];

const rich = [
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

class App extends Component {
  state = {
    design: [undefined, { id: 1, components: [...rich] }],
    screen: 1,
    selected: 1,
  }

  componentDidMount() {
    const { location } = document;
    const params = {};
    location.search.slice(1).split('&').forEach(p => {
      const [k, v] = p.split('=');
      params[k] = v;
    });
    if (params.d) {
      const text = LZString.decompressFromEncodedURIComponent(params.d);
      const design = JSON.parse(text);
      this.setState({ design, screen: 1, selected: 1 });
    } else {
      const stored = localStorage.getItem('design');
      if (stored) {
        const design = JSON.parse(stored);
        const screen = JSON.parse(localStorage.getItem('screen')) || 1;
        const selected = JSON.parse(localStorage.getItem('selected')) || 1;
        this.setState({ design, screen, selected });
      }
    }
    if (params.theme) {
      this.setState({ theme: themes[params.theme] });
    }
    if (params.preview) {
      this.setState({ preview: true });
    }
  }

  onAdd = (typeName) => {
    const { design, screen, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    let nextScreen;
    let nextSelected;
    if (typeName === 'Screen') {
      nextDesign.push({ id: nextDesign.length, components: [...bare] });
      nextScreen = nextDesign.length - 1;
      nextSelected = 1;
    } else {
      const type = types[typeName];
      const component = {
        type: typeName,
        id: nextDesign[screen].components.length,
        props: type.defaultProps ? { ...type.defaultProps } : {},
      };
      nextDesign[screen].components[component.id] = component;
      const parent = nextDesign[screen].components[selected];
      if (!parent.children) parent.children = [];
      parent.children.push(component.id);
      nextScreen = screen;
      nextSelected = component.id;
    }
    this.setState({
      design: nextDesign, 
      screen: nextScreen,
      selected: nextSelected,
      adding: false,
    });
    localStorage.setItem('design', JSON.stringify(nextDesign));
    localStorage.setItem('screen', nextScreen);
    localStorage.setItem('selected', nextSelected);
  }

  onDelete = (id) => {
    const { design, screen } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const parent = nextDesign[screen].components
      .find(c => (c && c.children && c.children.includes(id)));
    nextDesign[screen].components[id] = undefined;
    parent.children = parent.children.filter(i => i !== id);
    this.setState({ design: nextDesign, selected: parent.id });
    localStorage.setItem('design', JSON.stringify(nextDesign));
    localStorage.setItem('selected', parent.id);
  }

  select = (screen, selected) => {
    this.setState({ screen, selected });
    localStorage.setItem('screen', screen);
    localStorage.setItem('selected', selected);
  }

  setProp = (id, propName, option) => {
    const { design, screen } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign[screen].components[id];
    component.props[propName] = option;
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  setText = (id, text) => {
    const { design, screen } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign[screen].components[id].text = text;
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  onLink = (screenId) => {
    const { design, screen, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign[screen].components[selected].linkTo = screenId;
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  moveChild = (moveId, targetId, where) => {
    const { design, screen } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from old parent
    const priorParent = nextDesign[screen].components
      .find(c => (c && c.children && c.children.includes(moveId)));
    const priorIndex = priorParent.children.indexOf(moveId);
    priorParent.children.splice(priorIndex, 1);
    // insert into new parent
    if (where === 'in') {
      const parent = nextDesign[screen].components[targetId];
      if (!parent.children) parent.children = [];
      parent.children.unshift(moveId);
    } else {
      const nextParent = nextDesign[screen].components
        .find(c => (c && c.children && c.children.includes(targetId)));
      const nextIndex = nextParent.children.indexOf(targetId);
      nextParent.children.splice(where === 'above' ? nextIndex : nextIndex + 1,
        0, moveId);
    }
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  reset = () => {
    const { location } = document;
    const design = [undefined, { id: 1, components: [...bare] }];
    this.setState({ design, screen: 1, selected: 1 });
    localStorage.setItem('design', JSON.stringify(design));
    localStorage.setItem('screen', 1);
    localStorage.setItem('selected', 1);
    location.replace('?');
  }

  renderDropArea = (id, where) => {
    const { dragging, dropWhere, dropTarget } = this.state;
    return (
      <Box
        pad="xxsmall"
        background={dragging && dropTarget === id && dropWhere === where
          ? 'accent-2' : undefined}
        onDragEnter={(event) => {
          if (dragging && dragging !== id) {
            event.preventDefault();
            this.setState({ dropTarget: id, dropWhere: where });
          } else {
            this.setState({ dropTarget: undefined });
          }
        }}
        onDragOver={(event) => {
          if (dragging && dragging !== id) {
            event.preventDefault();
          }
        }}
        onDrop={() => this.moveChild(dragging, id, where)}
      />
    );
  }

  renderTree = (screenId, id, firstChild) => {
    const { design, dragging, dropTarget, dropWhere, screen, selected } = this.state;
    const component = design[screenId].components[id];
    const type = types[component.type];
    return (
      <Box key={id} pad={{ left: 'small' }}>
        {firstChild && this.renderDropArea(id, 'before')}
        <Button
          hoverIndicator
          onClick={() => this.select(screenId, id)}
          draggable
          onDragStart={() => this.setState({ dragging: id })}
          onDragEnd={() => this.setState({ dragging: undefined, dropTarget: undefined })}
          onDragEnter={() => {
            if (dragging && dragging !== id && !type.text
              && type.name !== 'Icon') {
              this.setState({ dropTarget: id, dropWhere: 'in' });
            }
          }}
          onDragOver={(event) => {
            if (dragging && dragging !== id) event.preventDefault();
          }}
          onDrop={() => this.moveChild(dragging, id, dropWhere)}
        >
          <Box
            pad="xsmall"
            background={(dropTarget === id && dropWhere === 'in') ? 'accent-2' :
              (screenId === screen && selected === id ? 'accent-1' : undefined)}
          >
            <Text>{component.name || type.name}</Text>
          </Box>
        </Button>
        {component.children &&
          component.children.map((id, index) => this.renderTree(screenId, id, index === 0))}
        {this.renderDropArea(id, 'after')}
      </Box>
    )
  }

  renderComponent = (id) => {
    const { design, screen, selected, theme } = this.state;
    const component = design[screen].components[id];
    const type = types[component.type];
    return React.createElement(
      type.component,
      {
        key: id,
        onClick: (event) => {
          event.stopPropagation();
          const nextScreen = component.linkTo || screen;
          this.setState({ screen: nextScreen, selected: nextScreen ? 1 : id });
        },
        style: selected === id ? { outline: '1px dashed red' } : undefined,
        ...component.props,
        theme: (id === 1 ? (theme || grommet) : undefined),
      },
      component.children
      ? component.children.map(childId => this.renderComponent(childId))
      : component.text || type.text);
  }

  render() {
    const { adding, design, preview, screen, selected, theme } = this.state;
    const selectedComponent = design[screen].components[selected];
    const selectedtype = types[selectedComponent.type];
    return (
      <Grommet full theme={theme || grommet}>
        <ResponsiveContext.Consumer>
          {(responsive) => (
            <Grid
              fill
              columns={(responsive === 'small' || preview)
                ? 'flex' : ['small', 'flex', 'small']}
            >

              {responsive !== 'small' && !preview && (
                <Box background="light-2">
                  {selectedtype.text || selectedtype.name === 'Icon' ? (
                    <Box height="xxsmall" />
                  ) : (
                    <Button
                      title="add component"
                      icon={<Add />}
                      hoverIndicator
                      onClick={() => this.setState({ adding: true })}
                    />
                  )}
                  <Box flex="grow">
                    {design.filter(s => s).map(screen => (
                      <Box key={screen.id}>
                        <Heading level={3} size="small" margin="small">
                          {`Screen ${screen.id}`}
                        </Heading>
                        {this.renderTree(screen.id, 1)}
                      </Box>
                    ))}
                  </Box>
                  <Box direction="row" justify="between" align="center">
                    <Button
                      title="delete all"
                      icon={<Trash />}
                      hoverIndicator
                      onClick={this.reset}
                    />
                    <Button
                      title="share"
                      icon={<Share />}
                      hoverIndicator
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`?d=${LZString.compressToEncodedURIComponent(JSON.stringify(design))}`}
                    />
                  </Box>
                  {adding && (
                    <Adder onAdd={this.onAdd} onClose={() => this.setState({ adding: false })} />
                  )}
                </Box>
              )}

              <Box>
                {this.renderComponent(1)}
              </Box>

              {responsive !== 'small' && !preview && (
                <Properties
                  design={design}
                  component={design[screen].components[selected]}
                  onSetText={text => this.setText(selected, text)}
                  onSetProp={(propName, value) => this.setProp(selected, propName, value)}
                  onDelete={() => this.onDelete(selected)}
                  onLink={screen => this.onLink(screen)}
                />
              )}

            </Grid>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }
}

export default App;
