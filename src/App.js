import React, { Component } from 'react';
import {
  Box, Button, Grommet, Grid, Heading, Text, grommet,
} from 'grommet';
import { Add } from 'grommet-icons';
import { componentTypes, Adder } from './Types';
import Properties from './Properties';

class App extends Component {
  state = {
    design: [
      undefined, // leave id 0 undefined
      { id: 1, componentType: 'Grommet', props: { style: { height: '100vh' } } },
    ],
    selected: 1,
  }

  componentDidMount() {
    const stored = localStorage.getItem('design');
    if (stored) {
      const design = JSON.parse(stored);
      const selected = JSON.parse(localStorage.getItem('selected')) || 1;
      this.setState({ design, selected });
    }
  }

  onAdd = (componentType) => {
    const { design, selected } = this.state;
    const nextDesign = [...design];
    const type = componentTypes[componentType];
    const component = {
      componentType,
      id: design.length,
      props: type.defaultProps ? { ...type.defaultProps } : {},
    };
    nextDesign[component.id] = component;
    const parent = { ...design[selected] };
    if (!parent.children) parent.children = [];
    parent.children.push(component.id);
    nextDesign[selected] = parent;
    this.setState({ design: nextDesign, selected: component.id, adding: false });
    localStorage.setItem('design', JSON.stringify(nextDesign));
    localStorage.setItem('selected', component.id);
  }

  onDelete = (id) => {
    const { design } = this.state;
    const nextDesign = [...design];
    const parent = { ...design.find(c => (c && c.children && c.children.includes(id)))};
    nextDesign[id] = undefined;
    parent.children = parent.children.filter(i => i !== id);
    nextDesign[parent.id] = parent;
    this.setState({ design: nextDesign, selected: parent.id });
    localStorage.setItem('design', JSON.stringify(nextDesign));
    localStorage.setItem('selected', parent.id);
  }

  select = (id) => {
    this.setState({ selected: id });
    localStorage.setItem('selected', id);
  }

  setProp = (id, propName, option) => {
    const { design } = this.state;
    const nextDesign = [...design];
    const component = { ...nextDesign[id] };
    component.props[propName] = option;
    nextDesign[component.id] = component;
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  setText = (id, text) => {
    const { design } = this.state;
    const nextDesign = [...design];
    nextDesign[id] = { ...nextDesign[id], text };
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  moveChild = (moveId, afterId) => {
    const { design } = this.state;
    const nextDesign = [...design];
    // remove from old parent
    const priorParent = { ...design.find(c => (c && c.children && c.children.includes(moveId)))};
    const priorIndex = priorParent.children.indexOf(moveId);
    priorParent.children.splice(priorIndex, 1);
    // insert into new parent
    const nextParent = { ...design.find(c => (c && c.children && c.children.includes(afterId)))};
    const nextIndex = nextParent.children.indexOf(afterId);
    nextParent.children.splice(nextIndex + 1, 0, moveId);
    nextDesign[priorParent.id] = priorParent;
    nextDesign[nextParent.id] = nextParent;
    this.setState({ design: nextDesign });
    localStorage.setItem('design', JSON.stringify(nextDesign));
  }

  renderTree = (id) => {
    const { design, dragging, dropTarget, selected } = this.state;
    const component = design[id];
    const componentType = componentTypes[component.componentType];
    return (
      <Box key={id} pad={{ left: 'small' }}>
        <Button
          hoverIndicator
          onClick={() => this.select(id)}
          draggable
          onDragStart={() => this.setState({ dragging: id })}
          onDragEnd={() => this.setState({ dragging: undefined, dropTarget: undefined })}
          onDragEnter={(event) => {
            if (dragging !== id) {
              event.preventDefault();
              this.setState({ dropTarget: id });
            } else {
              this.setState({ dropTarget: undefined });
            }
          }}
          onDragOver={(event) => {
            if (dragging !== id) {
              event.preventDefault();
            }
          }}
          onDrop={() => this.moveChild(dragging, id)}
        >
          <Box
            pad="xsmall"
            background={selected === id ? 'accent-1' : undefined}
            border={dropTarget === id ? { side: 'bottom', color: 'accent-2' } : undefined}
          >
            <Text>{component.name || componentType.name}</Text>
          </Box>
        </Button>
        {component.children && component.children.map(id => this.renderTree(id))}
      </Box>
    )
  }

  renderComponent = (id) => {
    const { design, selected } = this.state;
    const component = design[id];
    const componentType = componentTypes[component.componentType];
    return React.createElement(
      componentType.component,
      {
        key: id,
        onClick: (event) => {
          event.stopPropagation();
          this.setState({ selected: id });
        },
        style: selected === id ? { outline: '1px dashed red' } : undefined,
        ...component.props,
      },
      component.children
      ? component.children.map(childId => this.renderComponent(childId))
      : component.text || componentType.text);
  }

  render() {
    const { adding, design, selected } = this.state;
    const selectedComponent = design[selected];
    const selectedComponentType = componentTypes[selectedComponent.componentType];
    return (
      <Grommet full theme={grommet}>
        <Grid fill columns={['small', 'flex', 'small']}>

          <Box background="light-2">
            {selectedComponentType.text ? (
              <Box height="xxsmall" />
            ) : (
              <Button
                icon={<Add />}
                hoverIndicator
                onClick={() => this.setState({ adding: true })}
              />
            )}
            {this.renderTree(1)}
            {adding && (
              <Adder onAdd={this.onAdd} onClose={() => this.setState({ adding: false })} />
            )}
          </Box>

          <Box>
            {this.renderComponent(1)}
          </Box>

          <Properties
            component={design[selected]}
            onSetText={text => this.setText(selected, text)}
            onSetProp={(propName, value) => this.setProp(selected, propName, value)}
            onDelete={() => this.onDelete(selected)}
          />

        </Grid>
      </Grommet>
    );
  }
}

export default App;
