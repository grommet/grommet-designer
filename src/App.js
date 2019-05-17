import React, { Component } from 'react';
import {
  Box, Grommet, Grid, ResponsiveContext, dark, grommet,
} from 'grommet';
import { dxc } from 'grommet-theme-dxc';
import { hpe } from 'grommet-theme-hpe';
import LZString from 'lz-string';
import { types } from './Types';
import Properties from './Properties';
import Tree from './Tree';
import Icon from './Icon';
import { getComponent, getParent, resetState, rich } from './designs';

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
      const screen = parseInt(Object.keys(design.screens)[0], 10);
      const component = parseInt(Object.keys(screen.components)[0], 10);
      this.setState({ design, selected: { screen, component } });
    } else {
      const stored = localStorage.getItem('design');
      if (stored) {
        const design = JSON.parse(stored);
        const selected = JSON.parse(localStorage.getItem('selected'));
        this.setState({ design, selected });
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
    if (nextState.design) {
      localStorage.setItem('design', JSON.stringify(nextState.design));
    }
    if (nextState.selected) {
      localStorage.setItem('selected', JSON.stringify(nextState.selected));
    }
  }

  onDelete = () => {
    const { design, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from the parent
    const parent = getParent(nextDesign, selected);
    parent.children = parent.children.filter(i => i !== selected.component);
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

  renderComponent = (id) => {
    const { design, selected, theme } = this.state;
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
    return React.createElement(
      type.component,
      {
        key: id,
        onClick: (event) => {
          event.stopPropagation();
          if (component.linkTo) {
            if (component.linkTo.screen === selected.screen) {
              const layer = getComponent(design, component.linkTo);
              this.setHide(layer.id, !layer.hide);
            } else {
              this.onChange({ selected: { ...component.linkTo } });
            }
          } else {
            this.onChange({ selected: { ...selected, component: id } });
          }
        },
        style: selected.component === id
          ? { outline: '1px dashed red' } : undefined,
        ...component.props,
        ...specialProps,
        theme: (type.name === 'Grommet' ? (theme || grommet) : undefined),
      },
      component.children
        ? component.children.map(childId => this.renderComponent(childId))
        : component.text || type.text);
  }

  render() {
    const { design, preview, selected, theme } = this.state;
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
                <Tree
                  design={design}
                  selected={selected}
                  onChange={this.onChange}
                />
              )}

              <Box>
                {this.renderComponent(parseInt(Object.keys(
                  design.screens[selected.screen].components)[0], 10))}
              </Box>

              {responsive !== 'small' && !preview && (
                <Properties
                  design={design}
                  selected={selected}
                  component={getComponent(design, selected)}
                  onChange={this.onChange}
                  onDelete={this.onDelete}
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
