import React, { Component } from 'react';
import { Box, Button, Heading, Text } from 'grommet';
import { Add, Share, Trash } from 'grommet-icons';
import LZString from 'lz-string';
import { types, Adder } from './Types';
import { bare } from './designs';

class Tree extends Component {
  state = {}

  onAdd = (typeName) => {
    const { design, screen, selected, onChange } = this.props;
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
    this.setState({ adding: false });
    onChange({ design: nextDesign, screen: nextScreen, selected: nextSelected });
  }

  onDelete = (id) => {
    const { design, screen, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const parent = nextDesign[screen].components
      .find(c => (c && c.children && c.children.includes(id)));
    nextDesign[screen].components[id] = undefined;
    parent.children = parent.children.filter(i => i !== id);
    onChange({ design: nextDesign, selected: parent.id });
  }

  select = (screen, selected) => {
    const { onChange } = this.props;
    onChange({ screen, selected });
  }

  moveChild = (moveId, targetId, where) => {
    const { design, screen, onChange } = this.props;
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
    onChange({ design: nextDesign });
  }

  deleteScreen = () => {
    const { design, screen, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    delete nextDesign[screen];
    let nextScreen = screen - 1;
    while (nextScreen && !design[nextScreen]) nextScreen -= 1;
    onChange({ design: nextDesign, screen: nextScreen, selected: 1 });
  }

  reset = () => {
    const { location } = document;
    const { onChange } = this.props;
    const nextDesign = [undefined, { id: 1, components: [...bare] }];
    onChange({ design: nextDesign, screen: 1, selected: 1 });
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
    const { design, screen, selected } = this.props;
    const { dragging, dropTarget, dropWhere } = this.state;
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
              (screenId === screen && selected === id ? 'accent-1' :
              (component.hide ? 'light-4' : undefined))}
          >
            <Text>
              {component.type === 'Layer' ? `${type.name} ${component.id}`
                : component.name || type.name}
            </Text>
          </Box>
        </Button>
        {component.children &&
          component.children.map((id, index) =>
            this.renderTree(screenId, id, index === 0))}
        {this.renderDropArea(id, 'after')}
      </Box>
    )
  }

  render() {
    const { design, screen, selected } = this.props;
    const { adding } = this.state;
    const selectedComponent = design[screen].components[selected];
    const selectedtype = types[selectedComponent.type];
    return (
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
          {design.filter(s => s).map(s => (
            <Box key={s.id}>
              <Box direction="row" align="center" justify="between">
                <Heading level={3} size="small" margin="small">
                  {`Screen ${s.id}`}
                </Heading>
                {s.id === screen && design.length > 1 ? (
                  <Button icon={<Trash />} onClick={this.deleteScreen} />
                ) : null}
              </Box>
              {this.renderTree(s.id, 1)}
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
    );
  }
}

export default Tree;
