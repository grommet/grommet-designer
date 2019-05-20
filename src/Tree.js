import React, { Component } from 'react';
import { Box, Button, Heading, Keyboard, Stack, Text } from 'grommet';
import { Add, Folder, FormDown, FormUp, Share,  Trash } from 'grommet-icons';
import { types, Adder } from './Types';
import {
  addScreen, defaultComponent, getComponent, getParent, bare, resetState,
} from './designs';

class Tree extends Component {
  state = {}

  onAdd = (typeName) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = { ...selected };
    if (typeName === 'Screen') {
      nextSelected.screen = addScreen(nextDesign, bare);
      nextSelected.component = parseInt(Object.keys(
        nextDesign.screens[nextSelected.screen].components)[0], 10);
    } else {
      const type = types[typeName];
      const id = nextDesign.nextId;
      nextDesign.nextId += 1;
      const component = {
        type: typeName,
        id,
        props: type.defaultProps ? { ...type.defaultProps } : {},
      };
      nextDesign.screens[selected.screen].components[component.id] = component;
      const parent = getComponent(nextDesign, selected);
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
    const priorIndex = priorParent.children.indexOf(dragging.component);
    priorParent.children.splice(priorIndex, 1);
    // insert into new parent
    if (where === 'in') {
      const parent = getComponent(nextDesign, target);
      if (!parent.children) parent.children = [];
      parent.children.unshift(dragging.component);
    } else {
      const nextParent = getParent(nextDesign, target);
      const nextIndex = nextParent.children.indexOf(target.component);
      nextParent.children.splice(where === 'before' ? nextIndex : nextIndex + 1,
        0, dragging.component);
    }
    this.setState({ dragging: undefined, dropTarget: undefined });
    onChange({ design: nextDesign });
  }

  toggleCollapse = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = getComponent(nextDesign, selected);
    component.collapsed = !component.collapsed;
    onChange({ design: nextDesign });
  }

  deleteScreen = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    delete nextDesign.screens[selected.screen];
    let nextScreen = selected.screen - 1;
    while (nextScreen && !design.screens[nextScreen]) nextScreen -= 1;
    const nextSelected = {
      screen: nextScreen,
      component: defaultComponent(nextDesign, nextScreen),
    };
    onChange({ design: nextDesign, selected: nextSelected });
    this.setState({ confirmDelete: false });
  }

  reset = () => {
    const { location } = document;
    const { onChange } = this.props;
    onChange(resetState());
    this.setState({ confirmReset: false });
    location.replace('?');
  }

  onKeyDown = (event) => {
    if (event.metaKey) {
      if (event.keyCode === 65) { // a
        event.preventDefault();
        this.setState({ adding: true });
      }
    }
  }

  renderDropArea = (ids, where) => {
    const { dragging, dropWhere, dropTarget } = this.state;
    return (
      <Box
        pad="xxsmall"
        background={dragging && dropTarget && dropTarget.screen === ids.screen
          && dropTarget.component === ids.component && dropWhere === where
          ? 'accent-2' : undefined}
        onDragEnter={(event) => {
          if (dragging && dragging.component !== ids.component) {
            event.preventDefault();
            this.setState({ dropTarget: ids, dropWhere: where });
          } else {
            this.setState({ dropTarget: undefined });
          }
        }}
        onDragOver={(event) => {
          if (dragging && dragging.component !== ids.component) {
            event.preventDefault();
          }
        }}
        onDrop={() => this.moveChild(dragging, dropTarget, dropWhere)}
      />
    );
  }

  renderTree = (ids, firstChild) => {
    const { design, selected } = this.props;
    const { dragging, dropTarget, dropWhere } = this.state;
    const component = getComponent(design, ids);
    if (!component) return null;
    const type = types[component.type];
    return (
      <Box key={ids.component}>
        {firstChild && this.renderDropArea(ids, 'before')}
        <Stack anchor="right">
          <Button
            fill
            hoverIndicator
            onClick={() => this.select(ids)}
            draggable
            onDragStart={() => this.setState({ dragging: ids })}
            onDragEnd={() =>
              this.setState({ dragging: undefined, dropTarget: undefined })}
            onDragEnter={() => {
              if (dragging && dragging.component !== ids.component && !type.text
                && type.name !== 'Icon') {
                this.setState({ dropTarget: ids, dropWhere: 'in' });
              }
            }}
            onDragOver={(event) => {
              if (dragging && dragging !== ids.component && !type.text) {
                event.preventDefault();
              }
            }}
            onDrop={() => this.moveChild(dragging, dropTarget, dropWhere)}
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={
                (dropTarget && dropTarget.screen === ids.screen
                  && dropTarget.component === ids.component && dropWhere === 'in')
                ? 'accent-2'
                : (selected.screen === ids.screen
                  && selected.component === ids.component
                  ? 'active' : undefined)
              }
            >
              <Text truncate>
                {component.type === 'Layer' ? `${type.name} ${component.id}`
                  : component.name || component.text
                  || component.props.name || component.props.label
                  || type.name}
              </Text>
            </Box>
          </Button>
          {selected.screen === ids.screen
            && selected.component === ids.component
            && component.children && (
            <Button
              icon={component.collapsed ? <FormDown /> : <FormUp />}
              onClick={this.toggleCollapse}
            />
          )}
        </Stack>
        {!component.collapsed && component.children && (
          <Box pad={{ left: 'small' }}>
            {component.children.map((childId, index) =>
              this.renderTree({ screen: ids.screen, component: childId },
                index === 0))}
          </Box>
        )}
        {this.renderDropArea(ids, 'after')}
      </Box>
    )
  }

  render() {
    const { design, selected, onManage, onShare } = this.props;
    const { adding, confirmDelete, confirmReset } = this.state;
    const selectedComponent = getComponent(design, selected);
    const selectedtype = types[selectedComponent.type];
    const isContainer = !(selectedtype.text || selectedtype.name === 'Icon');
    return (
      <Keyboard target="document" onKeyDown={isContainer ? this.onKeyDown : undefined}>
        <Box background="light-2" height="100vh">
          <Box flex={false}>
            {isContainer ? (
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
              {Object.keys(design.screens)
                .map(sId => design.screens[sId]).map(s => (
                <Box key={s.id}>
                  <Box direction="row" align="center" justify="between">
                    <Heading level={3} size="small" margin="small">
                      {`Screen ${s.id}`}
                    </Heading>
                    {s.id === selected.screen
                      && Object.keys(design.screens).length > 1
                      ? (
                      <Box direction="row" align="center">
                        {confirmDelete && (
                          <Button
                            title="confirm delete"
                            icon={<Trash color="status-critical" />}
                            hoverIndicator
                            onClick={this.deleteScreen}
                          />
                        )}
                        <Button
                          title="delete screen"
                          icon={<Trash />}
                          hoverIndicator
                          onClick={() => this.setState({ confirmDelete: !confirmDelete })}
                        />
                      </Box>
                    ) : null}
                  </Box>
                  {this.renderTree({
                    screen: s.id,
                    component: defaultComponent(design, s.id),
                  })}
                </Box>
              ))}
            </Box>
          </Box>
          <Box 
            flex={false}
            direction="row"
            justify="between"
            align="center"
          >
            <Button
              title="delete all"
              icon={<Trash />}
              hoverIndicator
              onClick={() => this.setState({ confirmReset: !confirmReset })}
            />
            {confirmReset && (
              <Button
                title="confirm delete"
                icon={<Trash color="status-critical" />}
                hoverIndicator
                onClick={this.reset}
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
          </Box>
          {adding && (
            <Adder
              onAdd={this.onAdd}
              onClose={() => this.setState({ adding: false })}
            />
          )}
        </Box>
      </Keyboard>
    );
  }
}

export default Tree;
