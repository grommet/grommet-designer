import React, { Component } from 'react';
import {
  Grommet, Grid, Keyboard, ResponsiveContext, dark, grommet,
} from 'grommet';
import { aruba } from 'grommet-theme-aruba';
import { dxc } from 'grommet-theme-dxc';
import { hp } from 'grommet-theme-hp';
import { hpe } from 'grommet-theme-hpe';
import LZString from 'lz-string';
import Canvas from './Canvas';
import Properties from './Properties';
import Tree from './Tree';
import Manage from './Manage';
import Share from './Share';
import {
  bucketUrl, bucketKey, getParent, resetState, upgradeDesign, bare, rich,
} from './designs';
import ScreenDetails from './ScreenDetails';

const themes = { aruba, dark, dxc, grommet, hp, hpe };

class App extends Component {
  state = { ...resetState(rich), theme: grommet };

  componentDidMount() {
    const { location } = document;
    const params = {};
    location.search.slice(1).split('&').forEach(p => {
      const [k, v] = p.split('=');
      params[k] = v;
    });
    if (params.n) {
      fetch(`${bucketUrl}/${params.n}?alt=media&${bucketKey}`)
      .then(response => response.json())
      .then((design) => {
        upgradeDesign(design);
        const screen = design.screenOrder[0];
        const component = design.screens[screen].root;
        const theme = design.theme ? themes[design.theme] : grommet;
        this.setState({ design, selected: { screen, component }, theme });
      });
    } else if (params.d) {
      const text = LZString.decompressFromEncodedURIComponent(params.d);
      const design = JSON.parse(text);
      upgradeDesign(design);
      const screen = design.screenOrder[0];
      const component = design.screens[screen].root;
      const theme = design.theme ? themes[design.theme] : grommet;
      this.setState({ design, selected: { screen, component }, theme });
    } else {
      let stored = localStorage.getItem('design');
      if (stored) {
        const design = JSON.parse(stored);
        upgradeDesign(design);
        const theme = design.theme ? themes[design.theme] : grommet;
        this.setState({ design, theme });
        stored = localStorage.getItem('selected');
        if (stored) {
          const selected = JSON.parse(stored);
          if (design.components[selected.component]) {
            this.setState({ selected });
          }
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
    const { design } = nextState;
    const { theme } = this.state;
    const nextTheme = (design && design.theme && themes[design.theme]) || theme || grommet;
    this.setState({ ...nextState, theme: nextTheme });
    // delay storing it locally so we don't bog down typing
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
    const parent = getParent(nextDesign, selected.component);
    parent.children = parent.children.filter(i => i !== selected.component);
    // TODO: remove any linkTo references
    delete nextDesign.components[selected.component];
    this.onChange({
      design: nextDesign,
      selected: { ...selected, component: parent.id },
    });
  }

  onReset = () => {
    localStorage.removeItem('selected');
    localStorage.removeItem('design');
    this.setState({ ...resetState(bare), theme: grommet });
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

  render() {
    const { design, managing, preview, selected, sharing, theme } = this.state;
    const rootComponent = design.screens[selected.screen].root;
    const selectedComponent = design.components[selected.component] || rootComponent;
    return (
      <Grommet full theme={theme}>
        <ResponsiveContext.Consumer>
          {(responsive) => (
            <Keyboard target="document" onKeyDown={this.onKeyDown}>
              <Grid
                fill
                columns={
                  (responsive === 'small' || preview)
                  ? 'flex'
                  : [['small', 'medium'], ['1/2', 'flex'], ['small', 'medium']]
                }
              >

                {responsive !== 'small' && !preview && (
                  <Tree
                    design={design}
                    selected={selected}
                    themes={Object.keys(themes)}
                    onChange={this.onChange}
                    onManage={() => this.setState({ managing: true })}
                    onShare={() => this.setState({ sharing: true })}
                    onReset={this.onReset}
                  />
                )}

                <Canvas
                  design={design}
                  selected={selected}
                  preview={preview}
                  theme={theme}
                  onChange={this.onChange}
                />

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
            onChange={this.onChange}
            onClose={() => this.setState({ sharing: false })}
          />
        )}
      </Grommet>
    );
  }
}

export default App;
