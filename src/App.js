import React, { Component } from 'react';
import {
  Box, Grommet, Grid, Keyboard, ResponsiveContext, dark, grommet,
} from 'grommet';
import { dxc } from 'grommet-theme-dxc';
import { hpe } from 'grommet-theme-hpe';
import LZString from 'lz-string';
import { types } from './Types';
import Properties from './Properties';
import Tree from './Tree';
import Icon from './Icon';
import Manage from './Manage';
import Share from './Share';
import {
  defaultComponent, getComponent, getParent, resetState, bare, rich,
} from './designs';
import ScreenDetails from './ScreenDetails';

const themes = { dark, dxc, hpe, grommet };

class App extends Component {
  state = resetState(rich);

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
      const screen = Object.keys(design.screens)[0];
      const component = Object.keys(design.screens[screen].components)[0];
      this.setState({ design, selected: { screen, component } });
    } else {
      let stored = localStorage.getItem('design');
      if (stored) {
        const design = JSON.parse(stored);
        this.setState({ design });
        stored = localStorage.getItem('selected');
        if (stored) {
          const selected = JSON.parse(stored);
          this.setState({ selected });
        }
      }
    }
    if (params.theme) {
      this.setState({ theme: themes[params.theme] });
    }
    if (params.preview) {
      this.setState({ preview: true });
    }
  }

  onChange = (nextState) => {
    this.setState(nextState);
    clearTimeout(this.storeTimer);
    this.storeTimer = setTimeout(() => {
      if (nextState.design) {
        localStorage.setItem('design', JSON.stringify(nextState.design));
      }
      if (nextState.selected) {
        localStorage.setItem('selected', JSON.stringify(nextState.selected));
      }
    }, 500);
  }

  onDelete = () => {
    const { design, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from the parent
    const parent = getParent(nextDesign, selected);
    parent.children = parent.children.filter(i => i !== selected.component);
    // TODO: remove any linkTo references
    delete nextDesign.screens[selected.screen].components[selected.component];
    this.onChange({
      design: nextDesign,
      selected: { ...selected, component: parent.id },
    });
  }

  setHide = (id, hide) => {
    const { design, selected: { screen } } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.screens[screen].components[id].hide = hide;
    this.onChange({ design: nextDesign });
  }

  onReset = () => {
    localStorage.removeItem('selected');
    localStorage.removeItem('design');
    this.setState(resetState(bare));
  }

  moveChild = (dragging, dropTarget) => {
    const { design, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from old parent
    const parent = getParent(nextDesign, { ...selected, component: dragging });
    const index = parent.children.indexOf(dragging);
    parent.children.splice(index, 1);
    // add to new parent
    const nextParent = getComponent(nextDesign, { ...selected, component: dropTarget });
    if (!nextParent.children) nextParent.children = [];
    nextParent.children.push(dragging);
    this.setState({ dragging: undefined, dropTarget: undefined });
    this.onChange({ design: nextDesign });
  }

  onKeyDown = (event) => {
    const { preview } = this.state;
    if (event.metaKey) {
      if (event.keyCode === 69) { // e
        event.preventDefault();
        this.setState({ preview: !preview });
      }
    }
  }

  renderComponent = (id) => {
    const { design, dropTarget, preview, selected, theme } = this.state;
    const component = design.screens[selected.screen].components[id];
    if (!component || component.hide) {
      return null;
    }
    const type = types[component.type];
    const specialProps = {};
    if (type.name === 'Button' && component.props.icon) {
      specialProps.icon = <Icon icon={component.props.icon} />;
    }
    if (type.name === 'Layer') {
      specialProps.onClickOutside = () => this.setHide(id, true);
      specialProps.onEsc = () => this.setHide(id, true);
    }
    const droppable = !type.text && type.name !== 'Icon';
    return React.createElement(
      type.component,
      {
        key: id,
        onClick: (event) => {
          if (!preview) event.stopPropagation();
          if (component.linkTo) {
            event.stopPropagation();
            const target = getComponent(design, component.linkTo);
            if (target) {
              if (component.linkTo.screen === selected.screen) {
                const layer = target;
                this.setHide(layer.id, !layer.hide);
              } else {
                this.onChange({ selected: { ...component.linkTo } });
              }
            } else {
              this.onChange({ selected: { ...selected, component: id } });
            }
          } else {
            this.onChange({ selected: { ...selected, component: id } });
          }
        },
        draggable: !preview && component.type !== 'Grommet',
        onDragStart: preview ? undefined : (event) => {
          event.stopPropagation();
          event.dataTransfer.setData('text/plain', 'ignored'); // for Firefox
          this.setState({ dragging: id });
        },
        onDragEnd: preview ? undefined : (event) => {
          event.stopPropagation();
          this.setState({ dragging: undefined, dropTarget: undefined });
        },
        onDragEnter: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging } = this.state;
          if (dragging && dragging !== id && droppable) {
            this.setState({ dropTarget: id });
          }
        },
        onDragOver: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging } = this.state;
          if (dragging && dragging !== id && droppable) {
            event.preventDefault();
          }
        },
        onDrop: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging, dropTarget } = this.state;
          this.moveChild(dragging, dropTarget);
        },
        style: !preview && selected.component === id
          ? { outline: '1px dashed red' }
          : (dropTarget === id ? { outline: '5px dashed blue' } : undefined),
        ...component.props,
        ...specialProps,
        theme: (type.name === 'Grommet' ? (theme || grommet) : undefined),
      },
      component.children
        ? component.children.map(childId => this.renderComponent(childId))
        : component.text || type.text);
  }

  render() {
    const { design, managing, preview, selected, sharing, theme } = this.state;
    const rootComponent = defaultComponent(design, selected.screen);
    const selectedComponent = getComponent(design, selected);
    return (
      <Grommet full theme={theme || grommet}>
        <ResponsiveContext.Consumer>
          {(responsive) => (
            <Keyboard target="document" onKeyDown={this.onKeyDown}>
              <Grid
                fill
                columns={(responsive === 'small' || preview)
                  ? 'flex' : ['small', 'flex', 'small']}
              >

                {responsive !== 'small' && !preview && (
                  <Tree
                    design={design}
                    selected={selected}
                    onChange={this.onChange}
                    onManage={() => this.setState({ managing: true })}
                    onShare={() => this.setState({ sharing: true })}
                    onReset={this.onReset}
                  />
                )}

                <Box>
                  {this.renderComponent(rootComponent)}
                </Box>

                {responsive !== 'small' && !preview && (
                  selectedComponent.type === 'Grommet' ? (
                    <ScreenDetails
                      design={design}
                      selected={selected}
                      onChange={this.onChange}
                    />
                  ) : (
                    <Properties
                      design={design}
                      selected={selected}
                      component={selectedComponent}
                      onChange={this.onChange}
                      onDelete={this.onDelete}
                    />
                  )
                )}

              </Grid>
            </Keyboard>
          )}
        </ResponsiveContext.Consumer>
        {managing && (
          <Manage
            design={design}
            onChange={(design) => {
              const nextState = resetState(design);
              this.onChange(nextState);
            }}
            onClose={() => this.setState({ managing: false })}
          />
        )}
        {sharing && (
          <Share
            design={design}
            onClose={() => this.setState({ sharing: false })}
          />
        )}
      </Grommet>
    );
  }
}

export default App;
