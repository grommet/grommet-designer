import React, { Component } from 'react';
import { Box, Heading, Keyboard, TextInput } from 'grommet';
import { Duplicate, Trash } from 'grommet-icons';
import { addScreen } from './design';
import ActionButton from './components/ActionButton';
import Field from './components/Field';

export default class ScreenDetails extends Component {

  state = {};

  setName = (name) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextScreen = { ...nextDesign.screens[selected.screen], name };
    nextDesign.screens[selected.screen] = nextScreen;
    onChange({ design: nextDesign });
  }

  onDelete = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    delete nextDesign.screens[selected.screen];
    const index = nextDesign.screenOrder.indexOf(selected.screen);
    nextDesign.screenOrder.splice(index, 1);
    const nextScreen = nextDesign.screenOrder[index ? index - 1 : index];
    const nextSelected = {
      screen: nextScreen,
      component: nextDesign.screens[nextScreen].root,
    };
    onChange({ design: nextDesign, selected: nextSelected });
    this.setState({ confirmDelete: false });
  }

  onDuplicate = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = {};
    nextSelected.screen = addScreen(nextDesign, nextDesign.screens[selected.screen]);
    nextSelected.component = nextDesign.screens[nextSelected.screen].root;
    onChange({ design: nextDesign, selected: nextSelected });
  }

  onKeyDown = (event) => {
    if (event.metaKey) {
      if (event.keyCode === 8) { // delete
        event.preventDefault();
        this.onDelete();
      }
    }
  }

  render() {
    const { colorMode, design, selected } = this.props;
    const { confirmDelete } = this.state;
    const screen = design.screens[selected.screen];
    return (
      <Keyboard target="document" onKeyDown={this.onKeyDown}>
        <Box
          background={colorMode === 'dark' ? 'dark-1' : 'white'}
          height="100vh"
          border="left"
        >
          <Box
            flex={false}
            direction="row"
            align="center"
            justify="between"
            border="bottom"
          >
            <Box flex pad="small">
              <Heading level={2} size="18px" margin="none" truncate>
                Screen
              </Heading>
            </Box>
            <Box flex={false} direction="row" align="center">
              <ActionButton
                title="duplicate"
                icon={<Duplicate />}
                hoverIndicator
                onClick={this.onDuplicate}
              />
              {confirmDelete && (
                <ActionButton
                  title="confirm delete"
                  icon={<Trash color="status-critical" />}
                  hoverIndicator
                  onClick={this.onDelete}
                />
              )}
              {design.screenOrder.length > 1 && (
                <ActionButton
                  title="delete"
                  icon={<Trash />}
                  hoverIndicator
                  onClick={() => this.setState({ confirmDelete: !confirmDelete })}
                />
              )}
            </Box>
          </Box>
          <Box flex overflow="auto">
            <Box flex={false}>
              <Field label="name" htmlFor="name">
                <TextInput
                  id="name"
                  name="name"
                  plain
                  value={screen.name || ''}
                  onChange={event => this.setName(event.target.value)}
                  style={{ textAlign: 'end' }}
                />
              </Field>
            </Box>
          </Box>
        </Box>
      </Keyboard>
    );
  }
}
