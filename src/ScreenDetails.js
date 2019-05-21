import React, { Component } from 'react';
import {
  Box, Button, Heading, Keyboard, TextArea,
} from 'grommet';
import { Duplicate, Trash } from 'grommet-icons';
import { addScreen, defaultComponent } from './designs';

export default class ScreenDetails extends Component {

  state = {};

  textRef = React.createRef();

  componentDidMount(prevProps) {
    if (this.textRef.current) {
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
    let nextScreen = selected.screen - 1;
    while (nextScreen && !design.screens[nextScreen]) nextScreen -= 1;
    const nextSelected = {
      screen: nextScreen,
      component: defaultComponent(nextDesign, nextScreen),
    };
    onChange({ design: nextDesign, selected: nextSelected });
    this.setState({ confirmDelete: false });
  }

  onDuplicate = () => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    const nextSelected = {};
    nextSelected.screen = addScreen(nextDesign, nextDesign.screens[selected.screen]);
    nextSelected.component = defaultComponent(nextDesign, nextSelected.screen);
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
        <Box background="light-2" height="100vh">
          <Box flex={false}>
            <Heading level={2} size="small" margin={{ horizontal: 'small' }}>
              {`Screen ${screen.id}`}
            </Heading>
          </Box>
          <Box flex overflow="auto">
            <Box flex={false}>
              <TextArea
                ref={this.textRef}
                value={screen.name || `Screen ${screen.id}`}
                onChange={event => this.setName(event.target.value)}
              />
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
            <Button
              title="delete"
              icon={<Trash />}
              hoverIndicator
              onClick={() => this.setState({ confirmDelete: !confirmDelete })}
            />
          </Box>
        </Box>
      </Keyboard>
    );
  }
}
