import React, { Component } from 'react';
import { Grommet, Grid, Keyboard, ResponsiveContext, grommet } from 'grommet';
import LZString from 'lz-string';
import Canvas from './Canvas';
import Properties from './Properties';
import Tree from './Tree/Tree';
import {
  bucketUrl, bucketKey, getInitialSelected, getParent, resetState,
  upgradeDesign, bare, welcome,
} from './design';
import ScreenDetails from './ScreenDetails';
import themes from './themes';

const normalizeTheme = (theme) => {
  if (typeof theme === 'string') {
    return themes[theme];
  } else if (typeof theme === 'object') {
    return theme;
  }
  return grommet;
};

class App extends Component {
  state = { ...resetState(welcome), theme: grommet, changes: [] };

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
        const selected = { screen, component };
        const theme = normalizeTheme(design.theme);
        document.title = design.name;
        this.setState({
          design,
          selected,
          theme,
          preview: true,
          changes: [{ design, selected }],
          changeIndex: 0,
        });
      });
    } else if (params.d) { // older method of sharing, deprecated
      const text = LZString.decompressFromEncodedURIComponent(params.d);
      const design = JSON.parse(text);
      upgradeDesign(design);
      const screen = design.screenOrder[0];
      const component = design.screens[screen].root;
      const selected = { screen, component };
      const theme = normalizeTheme(design.theme);
      this.setState({
        design,
        selected,
        theme,
        preview: true,
        changes: [{ design, selected }],
        changeIndex: 0,
      });
    } else {
      let stored = localStorage.getItem('activeDesign');
      if (stored) {
        stored = localStorage.getItem(stored) || localStorage.getItem('design');
      }
      if (stored) {
        const design = JSON.parse(stored);
        upgradeDesign(design);
        stored = localStorage.getItem('selected');
        const selected = stored ? JSON.parse(stored) : getInitialSelected(design);
        const theme = normalizeTheme(design.theme);
        this.setState({
          design,
          selected,
          theme,
          changes: [{ design, selected }],
          changeIndex: 0,
        });
      }
    }
    if (params.theme) {
      this.setState({ theme: themes[params.theme] });
    }
  }

  onChange = (nextState) => {
    const {
      design: previousDesign, theme, changes, changeIndex, selected,
    } = this.state;
    this.setState(nextState);

    if (nextState.design) {
      if (!this.debouncing) {
        this.debouncing = true;
      }
      const { design } = nextState;
      const nextTheme = (design.theme && normalizeTheme(design.theme))
        || theme || grommet;
      this.setState({ theme: nextTheme });
      // delay storing it locally so we don't bog down typing
      clearTimeout(this.storeTimer);
      this.storeTimer = setTimeout(() => {
        document.title = design.name;
        localStorage.setItem(design.name, JSON.stringify(design));
        localStorage.setItem('activeDesign', design.name);
        if (document.location.search) {
          // clear current URL, in case we've started editing a published design locally
          window.history.replaceState({}, design.name, '/');
        }
        // TODO: refactor how we remove previous design on rename
        // if (design.name !== previousDesign.name) {
        //   localStorage.removeItem(previousDesign.name);
        //   const stored = localStorage.getItem('designs');
        //   const designs = (stored ? JSON.parse(stored) : [])
        //     .filter(name => name !== previousDesign.name);
        //   if (!designs.includes(design.name)) designs.push(design.name);
        //   localStorage.setItem('designs', JSON.stringify(designs));
        //   this.setState({ designs });
        // }
        let nextChanges;
        if (design.created === previousDesign.created) {
          nextChanges = [...changes];
          nextChanges = nextChanges.slice(changeIndex, 10);
        } else {
          nextChanges = [];
        }
        nextChanges.unshift({ design, selected });
        this.setState({ changes: nextChanges, changeIndex: 0 });
        this.debouncing = false;
      }, 500);
    }

    if (nextState.selected) {
      localStorage.setItem('selected', JSON.stringify(nextState.selected));
    }
  }

  // TODO: move out of App.js
  onDelete = () => {
    const { design, selected } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from the parent
    const parent = getParent(nextDesign, selected.component);
    parent.children = parent.children.filter(i => i !== selected.component);
    // remove any linkTo references
    Object.keys(nextDesign.components).forEach(id => {
      const component = nextDesign.components[id];
      if (component.linkTo && component.linkTo.component === selected.component) {
        delete component.linkTo;
      }
    });
    // delete component
    delete nextDesign.components[selected.component];
    this.onChange({
      design: nextDesign,
      selected: { ...selected, component: parent.id },
    });
  }

  onReset = () => {
    localStorage.removeItem('selected');
    localStorage.removeItem('activeDesign');
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

  onUndo = () => {
    const { changes, changeIndex } = this.state;
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    this.setState({
      ...changes[nextChangeIndex],
      changeIndex: nextChangeIndex,
    });
  }

  onRedo = () => {
    const { changes, changeIndex } = this.state;
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    this.setState({
      ...changes[nextChangeIndex],
      changeIndex: nextChangeIndex,
    });
  }

  render() {
    const { design, preview, selected, theme, changes, changeIndex } = this.state;
    const rootComponent = design.screens[selected.screen
      || design.screenOrder[0]].root;
    const selectedComponent = design.components[selected.component]
      || rootComponent;
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
                    onChange={this.onChange}
                    onRedo={changeIndex > 0 && this.onRedo}
                    onUndo={changeIndex < (changes.length - 1) && this.onUndo}
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
      </Grommet>
    );
  }
}

export default App;
