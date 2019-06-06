import React, { Component } from 'react';
import { Box, Button, Heading, Keyboard, Stack, Text } from 'grommet';
import { Add, Configure, Folder, FormDown, FormUp, Share,  Trash } from 'grommet-icons';
import { types, Adder } from './Types';
import DesignSettings from './DesignSettings';
import { addScreen, getParent } from './designs';

class Tree extends Component {
  state = {}

  onAdd = (typeName) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };
    if (typeName === 'Screen') {
      nextSelected.screen = addScreen(nextDesign);
      nextSelected.component = nextDesign.screens[nextSelected.screen].root;
    } else {
      const type = types[typeName];
      const id = nextDesign.nextId;
      nextDesign.nextId += 1;
      const component = {
        type: typeName,
        id,
        props: type.defaultProps ? { ...type.defaultProps } : {},
      };
      nextDesign.components[component.id] = component;
      const parent = nextDesign.components[selected.component];
      if (!parent.children) parent.children = [];
      parent.children.push(component.id);
      nextSelected.component = component.id;
    }
    this.setState({ adding: false });
    onChange({ design: nextDesign, selected: nextSelected });
  }

  select = (selected) => {
    const { onChange } = this.props;
    onChange({ selected });
  }

  moveChild = (dragging, target, where) => {
    const { design, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from old parent
    const priorParent = getParent(nextDesign, dragging);
    const priorIndex = priorParent.children.indexOf(dragging);
    priorParent.children.splice(priorIndex, 1);
    // insert into new parent
    if (where === 'in') {
      const nextParent = nextDesign.components[target];
      if (!nextParent.children) nextParent.children = [];
      nextParent.children.unshift(dragging);
    } else {
      const nextParent = getParent(nextDesign, target);
      const nextIndex = nextParent.children.indexOf(target);
      nextParent.children.splice(where === 'before' ? nextIndex : nextIndex + 1,
        0, dragging);
    }
    this.setState({ dragging: undefined, dropTarget: undefined });
    onChange({
      design: nextDesign,
      // TODO: need to determine screen for where we dragged to!
      selected: { screen: target.screen, component: dragging },
    });
  }

  moveScreen = (dragging, target, where) => {
    const { design, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const moveIndex = nextDesign.screenOrder.indexOf(dragging);
    nextDesign.screenOrder.splice(moveIndex, 1);
    const targetIndex = nextDesign.screenOrder.indexOf(target);
    nextDesign.screenOrder.splice(where === 'before' ? targetIndex : targetIndex + 1,
      0, dragging);
    this.setState({ draggingScreen: undefined, dropScreenTarget: undefined });
    onChange({ design: nextDesign });
  }

  toggleCollapse = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.collapsed = !component.collapsed;
    onChange({ design: nextDesign });
  }

  onKeyDown = (event) => {
    if (event.metaKey) {
      // if (event.keyCode === 65) { // a
      //   event.preventDefault();
      //   this.setState({ adding: true });
      // }
    }
  }

  renderDropArea = (id, where) => {
    const { dragging, dropWhere, dropTarget } = this.state;
    return (
      <Box
        pad="xxsmall"
        background={dragging && dropTarget
          && dropTarget === id && dropWhere === where
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
        onDrop={() => this.moveChild(dragging, dropTarget, dropWhere)}
      />
    );
  }

  renderScreenDropArea = (screenId, where) => {
    const { draggingScreen, dropWhere, dropScreenTarget } = this.state;
    return (
      <Box
        pad="xxsmall"
        background={draggingScreen
          && dropScreenTarget && dropScreenTarget === screenId
          && dropWhere === where
          ? 'accent-2' : undefined}
        onDragEnter={(event) => {
          if (draggingScreen && draggingScreen !== screenId) {
            event.preventDefault();
            this.setState({ dropScreenTarget: screenId, dropWhere: where });
          } else {
            this.setState({ dropScreenTarget: undefined });
          }
        }}
        onDragOver={(event) => {
          if (draggingScreen && draggingScreen !== screenId) {
            event.preventDefault();
          }
        }}
        onDrop={() => this.moveScreen(draggingScreen, dropScreenTarget, dropWhere)}
      />
    );
  }

  renderComponent = (screen, id, firstChild) => {
    const { design, selected } = this.props;
    const { dragging, dropTarget, dropWhere } = this.state;
    const component = design.components[id];
    if (!component) return null;
    const type = types[component.type];
    return (
      <Box key={id}>
        {firstChild && this.renderDropArea(id, 'before')}
        <Stack anchor="right">
          <Button
            fill
            hoverIndicator
            onClick={() => this.select({ screen, component: id })}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', 'ignored'); // for Firefox
              this.setState({ dragging: id });
            }}
            onDragEnd={() =>
              this.setState({ dragging: undefined, dropTarget: undefined })}
            onDragEnter={() => {
              if (dragging && dragging !== id && type.container) {
                this.setState({ dropTarget: id, dropWhere: 'in' });
              }
            }}
            onDragOver={(event) => {
              if (dragging && dragging !== id && type.container) {
                event.preventDefault();
              }
            }}
            onDrop={() => this.moveChild(dragging, dropTarget, dropWhere)}
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={
                (dropTarget && dropTarget === id && dropWhere === 'in')
                ? 'accent-2'
                : (selected.component === id ? 'dark-2' : undefined)
              }
            >
              <Text truncate>
                {component.name || component.text
                  || component.props.name || component.props.label
                  || type.name}
              </Text>
            </Box>
          </Button>
          {selected.component === id && component.children && (
            <Button
              icon={component.collapsed ? <FormDown /> : <FormUp />}
              onClick={this.toggleCollapse}
            />
          )}
        </Stack>
        {!component.collapsed && component.children && (
          <Box pad={{ left: 'small' }}>
            {component.children.map((childId, index) =>
              this.renderComponent(screen, childId, index === 0))}
          </Box>
        )}
        {this.renderDropArea(id, 'after')}
      </Box>
    )
  }

  renderScreen = (screenId, firstScreen) => {
    const { design, selected } = this.props;
    const screen = design.screens[screenId];
    const id = screen.root;
    const component = design.components[id];
    return (
      <Box key={screen.id} flex={false}>
        {firstScreen && this.renderScreenDropArea(screenId, 'before')}
        <Stack anchor="right">
          <Button
            fill
            hoverIndicator
            onClick={() => this.select({ screen: screenId, component: id })}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', 'ignored'); // for Firefox
              this.setState({ draggingScreen: screenId });
            }}
            onDragEnd={() =>
              this.setState({ draggingScreen: undefined, dropScreenTarget: undefined })}
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={
                selected.screen === screenId && selected.component === id
                ? 'dark-2' : undefined
              }
            >
              <Heading level={3} size="small" margin="none">
                {screen.name || `Screen ${screen.id}`}
              </Heading>
            </Box>
          </Button>
          {selected.screen === screenId
            && selected.component === id
            && component.children && (
            <Button
              icon={component.collapsed ? <FormDown /> : <FormUp />}
              onClick={this.toggleCollapse}
            />
          )}
        </Stack>
        {!component.collapsed && component.children && (
          <Box flex={false}>
            {component.children.map((childId) =>
              this.renderComponent(screen.id, childId))}
          </Box>
        )}
        {this.renderScreenDropArea(screenId, 'after')}
      </Box>
    );
  }

  render() {
    const { design, selected, themes, onManage, onReset, onShare } = this.props;
    const { adding, configuring, confirmReset } = this.state;
    const selectedComponent = design.components[selected.component];
    const selectedType = types[selectedComponent.type];
    return (
      <Keyboard target="document" onKeyDown={selectedType.container ? this.onKeyDown : undefined}>
        <Box background="dark-1" height="100vh" border="right">
          <Box flex={false}>
            {selectedType.container ? (
              <Button
                title="add component"
                icon={<Add />}
                hoverIndicator
                onClick={() => this.setState({ adding: true })}
              />
            ) : (
              <Box height="xxsmall" />
            )}
          </Box>
          <Box flex overflow="auto">
            <Box flex={false}>
              {design.screenOrder.map((sId, index) =>
                  this.renderScreen(parseInt(sId, 10), index === 0))}
            </Box>
          </Box>
          <Box 
            flex={false}
            direction="row"
            justify="between"
            align="center"
          >
            <Button
              title="empty this design"
              icon={<Trash />}
              hoverIndicator
              onClick={() => this.setState({ confirmReset: !confirmReset })}
            />
            {confirmReset && (
              <Button
                title="confirm empty"
                icon={<Trash color="status-critical" />}
                hoverIndicator
                onClick={() => {
                  this.setState({ confirmReset: false });
                  onReset();
                }}
              />
            )}
            <Button
              title="all my designs"
              icon={<Folder />}
              hoverIndicator
              onClick={onManage}
            />
            <Button
              title="share"
              icon={<Share />}
              hoverIndicator
              onClick={onShare}
            />
            <Button
              title="settings"
              icon={<Configure />}
              hoverIndicator
              onClick={() => this.setState({ configuring: true })}
            />
          </Box>
          {adding && (
            <Adder
              onAdd={this.onAdd}
              onClose={() => this.setState({ adding: false })}
            />
          )}
          {configuring && (
            <DesignSettings
              design={design}
              themes={themes}
              onChange={this.onChange}
              onClose={() => this.setState({ configuring: false })}
            />
          )}
        </Box>
      </Keyboard>
    );
  }
}

export default Tree;
