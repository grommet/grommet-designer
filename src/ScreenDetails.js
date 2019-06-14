import React, { Component } from 'react';
import {
  Box, Button, FormField, Heading, Keyboard, TextInput,
} from 'grommet';
import { Duplicate, Trash } from 'grommet-icons';
import { addScreen } from './designs';

export default class ScreenDetails extends Component {

  state = {};

  textRef = React.createRef();

  componentDidMount(prevProps) {
    if (this.textRef.current) {
      this.textRef.current.select();
      this.textRef.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected.screen !== this.props.selected.screen
      && this.textRef.current) {
      this.textRef.current.select();
      this.textRef.current.focus();
    }
  }

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
    const { onDelete } = this.props;
    if (event.metaKey) {
      if (event.keyCode === 8) { // delete
        event.preventDefault();
        onDelete();
      }
    }
  }

  render() {
    const { design, selected } = this.props;
    const { confirmDelete } = this.state;
    const screen = design.screens[selected.screen];
    return (
      <Keyboard target="document" onKeyDown={this.onKeyDown}>
        <Box background="dark-1" height="100vh" border="left">
          <Box flex={false}>
            <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
              {screen.name || `Screen ${screen.id}`}
            </Heading>
          </Box>
          <Box flex overflow="auto">
            <Box flex={false}>
              <FormField label="name">
                <TextInput
                  ref={this.textRef}
                  value={screen.name || ''}
                  onChange={event => this.setName(event.target.value)}
                />
              </FormField>
            </Box>
          </Box>
          <Box flex={false} direction="row" align="center" justify="between">
            <Button
              title="duplicate"
              icon={<Duplicate />}
              hoverIndicator
              onClick={this.onDuplicate}
            />
            {confirmDelete && (
              <Button
                title="confirm delete"
                icon={<Trash color="status-critical" />}
                hoverIndicator
                onClick={this.onDelete}
              />
            )}
            {design.screenOrder.length > 1 && (
              <Button
                title="delete"
                icon={<Trash />}
                hoverIndicator
                onClick={() => this.setState({ confirmDelete: !confirmDelete })}
              />
            )}
          </Box>
        </Box>
      </Keyboard>
    );
  }
}
