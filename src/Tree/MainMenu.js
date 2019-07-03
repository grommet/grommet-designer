import React, { Component } from 'react';
import { Box, Button, DropButton, Heading, Text, grommet } from 'grommet';
import { Apps, FormDown, Share } from 'grommet-icons';
import { resetState, bare } from '../design';
import ActionButton from '../components/ActionButton';
import Code from './Code';
import ConfirmReset from './ConfirmReset';
import Data from './Data';
import Designs from './Designs';
import Publish from './Publish';
import Rename from './Rename';
import Theme from './Theme';
import Import from './Import';
import Sharing from './Share';

const MenuButton = ({ label, ...rest }) => (
  <Button hoverIndicator {...rest}>
    <Box pad={{ vertical: 'small', horizontal: 'medium' }}>
      <Text>{label}</Text>
    </Box>
  </Button>
);

class MainMenu extends Component {
  state = {}

  onDuplicate = () => {
    const { design, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.name = `${design.name} - 1`;
    onChange({ design: nextDesign });
  }

  onReset = () => {
    const { onChange } = this.props;
    localStorage.removeItem('selected');
    localStorage.removeItem('activeDesign');
    onChange({ ...resetState(bare), theme: grommet });
  }

  renderAction() {
    const { design, onChange } = this.props;
    const {
      changeTheme, choose, code, confirmReset, editData,
      importFile, publish, rename, share,
    } = this.state;
    if (rename) return (
      <Rename
        design={design}
        onClose={() => this.setState({ rename: undefined })}
        onChange={onChange}
      />
    );
    if (changeTheme) return (
      <Theme
        design={design}
        onClose={() => this.setState({ changeTheme: undefined })}
        onChange={onChange}
      />
    );
    if (editData) return (
      <Data
        design={design}
        onClose={() => this.setState({ editData: undefined })}
        onChange={onChange}
      />
    );
    if (share) return (
      <Sharing
        design={design}
        onClose={() => this.setState({ share: undefined })}
        onChange={onChange}
      />
    );
    if (publish) return (
      <Publish
        design={design}
        onClose={() => this.setState({ publish: undefined })}
        onChange={onChange}
      />
    );
    if (code) return (
      <Code
        design={design}
        onClose={() => this.setState({ code: undefined })}
        onChange={onChange}
      />
    );
    if (choose) return (
      <Designs
        design={design}
        onClose={() => this.setState({ choose: undefined })}
        onChange={onChange}
      />
    );
    if (importFile) return (
      <Import
        design={design}
        onClose={() => this.setState({ importFile: undefined })}
        onChange={onChange}
      />
    );
    if (confirmReset) return (
      <ConfirmReset
        onCancel={() => this.setState({ confirmReset: undefined })}
        onReset={() => {
          this.setState({ confirmReset: undefined });
          this.onReset();
        }}
      />
    );
    return null;
  }

  render() {
    const { design } = this.props;
    const { open } = this.state;
    return (
      <Box
        flex={false}
        direction="row"
        align="start"
        justify="between"
        pad="small"
        border="bottom"
      >
        <ActionButton
          icon={<Apps />}
          onClick={() => this.setState({ choose: true })}
        />
        <DropButton
          hoverIndicator
          open={open}
          dropAlign={{ top: 'bottom' }}
          overflow="auto"
          dropContent={(
            <Box
              flex={false}
              background="dark-1"
              pad={{ bottom: 'large' }}
              onClick={() => {
                clearTimeout(this.closeTimer);
                this.closeTimer = setTimeout(() => {
                  this.setState({ open: undefined });
                }, 10);
                this.setState({ open: false });
              }}
            >
              <Heading
                level={3}
                size="small"
                margin={{ horizontal: 'small', vertical: 'small' }}
              >
                Customize
              </Heading>
              <MenuButton label="Rename" onClick={() => this.setState({ rename: true })} />
              <MenuButton label="Change Theme" onClick={() => this.setState({ changeTheme: true })} />
              <MenuButton label="Setup Data" onClick={() => this.setState({ editData: true })} />
              <Heading
                level={3}
                size="small"
                margin={{ horizontal: 'small', vertical: 'small' }}
              >
                Share
              </Heading>
              <MenuButton label="Publish" onClick={() => this.setState({ publish: true })} />
              <MenuButton label="Generate Code" onClick={() => this.setState({ code: true })} />
              <MenuButton
                label="Export"
                title="Export design to a file"
                href={`data:application/json;charset=utf-8,${JSON.stringify(design)}`}
                download={`${design.name}.json`}
              />
              <MenuButton label="Import" onClick={() => this.setState({ importFile: true })} />
              <Heading
                level={3}
                size="small"
                margin={{ horizontal: 'small', vertical: 'small' }}
              >
                Manage
              </Heading>
              <MenuButton label="Duplicate" onClick={this.onDuplicate} />
              <MenuButton label="Switch" onClick={() => this.setState({ choose: true })} />
              <MenuButton label="Reset" onClick={() =>
                design.modified ? this.setState({ confirmReset: true }) : this.onReset()} />
            </Box>
          )}
        >
          <Box
            pad="medium"
            direction="row"
            align="center"
            justify="between"
          >
            <Heading size="22px" margin="none">{design.name}</Heading>
            <FormDown />
          </Box>
        </DropButton>
        <ActionButton
          icon={<Share />}
          onClick={() => this.setState({ share: true })}
        />
        {this.renderAction()}
      </Box>
    );
  }
}

export default MainMenu;
