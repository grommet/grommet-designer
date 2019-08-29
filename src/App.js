import React, { Component } from 'react';
import { Grommet, Grid, Keyboard, ResponsiveContext, grommet } from 'grommet';
import Canvas from './Canvas';
import Properties from './Properties';
import Tree from './Tree/Tree';
import {
  apiUrl, getInitialSelected, getScreenByPath, getParent,
  resetState, upgradeDesign, themeApiUrl, bare, loading,
} from './design';
import ScreenDetails from './ScreenDetails';
import themes from './themes';

const getParams = () => {
  const { location } = window;
  const params = {};
  location.search.slice(1).split('&').forEach(p => {
    const [k, v] = p.split('=');
    params[k] = decodeURIComponent(v);
  });
  return params;
}

class App extends Component {
  state = {
    ...resetState(loading),
    preview: true,
    theme: grommet,
    colorMode: 'dark',
    changes: [],
    designs: [],
  };

  componentDidMount() {
    const { location: { pathname, hash } } = window;
    const params = getParams();
    if (pathname === '/_new') {
      this.setState({
        ...resetState(bare),
        preview: false,
      });
    } else if (params.id) {
      fetch(`${apiUrl}/${params.id}`)
      .then(response => response.json())
      .then((design) => {
        upgradeDesign(design);
        const screen = hash ? parseInt(hash.slice(1), 10)
          : (getScreenByPath(design, pathname) || design.screenOrder[0]);
        const component = design.screens[screen].root;
        const selected = { screen, component };
        const theme = this.normalizeTheme(design.theme);
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
        const theme = this.normalizeTheme(design.theme);
        this.setState({
          design,
          selected,
          theme,
          changes: [{ design, selected }],
          changeIndex: 0,
          preview: false,
        });
      } else {
        this.setState({
          ...resetState(bare),
          preview: false,
        });
      }
    }
    // if (params.theme) {
    //   this.setState({ theme: themes[params.theme] });
    // }
    const stored = localStorage.getItem('designs');
    this.setState({ designs: stored ? JSON.parse(stored) : [] });

    this.setState({ colorMode: (localStorage.getItem('colorMode') || 'dark') });

    window.addEventListener('popstate', this.onPopState);
    window.addEventListener('hashchange', this.onHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
    window.removeEventListener('hashchange', this.onHashChange);
  }

  onPopState = () => {
    const { design } = this.state;
    const { location: { pathname } } = document;
    const screen = getScreenByPath(design, pathname);
    if (screen) {
      this.setState({ screen, component: design.screens[screen].root });
    }
  };

  onHashChange = () => {
    const { design } = this.state;
    const { location: { hash } } = document;
    if (hash) {
      const screen = parseInt(hash.slice(1), 10);
      this.setState({
        selected: { screen, component: design.screens[screen].root }
      });
    }
  }

  normalizeTheme = (theme) => {
    if (typeof theme === 'string') {
      if (theme.slice(0, 6) === 'https:') {
        this.loadTheme(theme);
        return undefined;
      }
      return themes[theme];
    } else if (typeof theme === 'object') {
      return theme;
    }
    return grommet;
  };

  loadTheme = (url) => {
    // extract id from URL
    const id = url.split('id=')[1];
    fetch(`${themeApiUrl}/${id}`)
      .then(response => response.json())
      .then((theme) => this.setState({ theme }));
  }

  onChange = (nextState) => {
    const {
      design: previousDesign, designs: previousDesigns, theme,
      changes, changeIndex, selected,
    } = this.state;
    this.setState(nextState);

    if (nextState.design) {
      if (!this.debouncing) {
        this.debouncing = true;
      }
      const { design } = nextState;
      const nextTheme = (design.theme && this.normalizeTheme(design.theme))
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
        if (!previousDesigns.includes(design.name)) {
          const designs = [design.name, ...previousDesigns];
          localStorage.setItem('designs', JSON.stringify(designs));
          this.setState({ designs });
        }
        let nextChanges;
        if (design.created === previousDesign.created) {
          nextChanges = [...changes];
          nextChanges = nextChanges.slice(changeIndex, 10);
        } else {
          nextChanges = [];
        }
        nextChanges.unshift({ design, selected: nextState.selected || selected });
        this.setState({ changes: nextChanges, changeIndex: 0 });
        this.debouncing = false;
      }, 1000);
    }

    if (nextState.selected) {
      localStorage.setItem('selected', JSON.stringify(nextState.selected));
      if (nextState.selected.screen !== selected.screen) {
        // track selected screen in browser location, so browser
        // backward/forward controls work
        const screen = (nextState.design || previousDesign)
          .screens[nextState.selected.screen];
        if (screen.path) {
          window.history.pushState(undefined, undefined, screen.path);
        } else {
          window.location.hash = `#${nextState.selected.screen}`;
        }
      }
    }

    if (nextState.colorMode) {
      localStorage.setItem('colorMode', nextState.colorMode);
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

  onKey = (event) => {
    const { preview } = this.state;
    if (event.metaKey) {
      if (event.key === 'e') {
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
    const {
      colorMode, design, preview, selected, theme, changes, changeIndex,
    } = this.state;
    const rootComponent = design.screens[selected.screen
      || design.screenOrder[0]].root;
    const selectedComponent = design.components[selected.component]
      || rootComponent;
    return (
      <Grommet full theme={grommet}>
        <ResponsiveContext.Consumer>
          {(responsive) => (
            <Keyboard target="document" onKeyDown={this.onKey}>
              <Grid
                fill
                columns={
                  (responsive === 'small' || preview)
                  ? 'flex'
                  : [['small', '288px'], ['1/2', 'flex'], ['small', 'medium']]
                }
              >

                {responsive !== 'small' && !preview && (
                  <Tree
                    design={design}
                    selected={selected}
                    colorMode={colorMode}
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
                      colorMode={colorMode}
                      onChange={this.onChange}
                    />
                  ) : (
                    <Properties
                      design={design}
                      theme={theme}
                      selected={selected}
                      component={selectedComponent}
                      colorMode={colorMode}
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
