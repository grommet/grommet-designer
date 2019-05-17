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
import { rich } from './designs';

const themes = { dark, dxc, hpe, grommet };

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

  onChange = (nextState) => {
    this.setState(nextState);
    if (nextState.design) {
      localStorage.setItem('design', JSON.stringify(nextState.design));
    }
    if (nextState.screen) {
      localStorage.setItem('screen', nextState.screen);
    }
    if (nextState.selected) {
      localStorage.setItem('selected', nextState.selected);
    }
  }

  select = (screen, selected) => {
    this.setState({ screen, selected });
    localStorage.setItem('screen', screen);
    localStorage.setItem('selected', selected);
  }

  renderComponent = (id) => {
    const { design, screen, selected, theme } = this.state;
    const component = design[screen].components[id];
    const type = types[component.type];
    const specialProps = {};
    if (type.name === 'Button' && component.props.icon) {
      specialProps.icon = <Icon icon={component.props.icon} />;
    }
    return React.createElement(
      type.component,
      {
        key: id,
        onClick: (event) => {
          event.stopPropagation();
          const nextScreen = component.linkTo || screen;
          this.setState({ screen: nextScreen, selected: component.linkTo ? 1 : id });
        },
        style: selected === id ? { outline: '1px dashed red' } : undefined,
        ...component.props,
        ...specialProps,
        theme: (id === 1 ? (theme || grommet) : undefined),
      },
      component.children
      ? component.children.map(childId => this.renderComponent(childId))
      : component.text || type.text);
  }

  render() {
    const { design, preview, screen, selected, theme } = this.state;
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
                  screen={screen}
                  selected={selected}
                  onChange={this.onChange}
                />
              )}

              <Box>
                {this.renderComponent(1)}
              </Box>

              {responsive !== 'small' && !preview && (
                <Properties
                  design={design}
                  screen={screen}
                  id={selected}
                  component={design[screen].components[selected]}
                  onChange={this.onChange}
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
