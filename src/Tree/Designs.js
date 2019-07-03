import React from 'react';
import { Box, Button, Grid, Stack, Text, grommet } from 'grommet';
import { Trash } from 'grommet-icons';
import { bare, getInitialSelected, resetState, upgradeDesign } from '../design';
import Action from '../components/Action';
import ActionButton from '../components/ActionButton';

const nameToBackground = (name) => {
  let num = 0;
  for (let i = 0; i < name.length; i++) {
    num += name.charCodeAt(i);
  }
  return `accent-${(num % 4) + 1}`;
};

const Designs = ({ design, onClose, onChange }) => {
  const [designs, setDesigns] = React.useState([]);
  const [error, setError] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();

  React.useEffect(() => {
    let item = localStorage.getItem('designs'); // array of names
    if (item) {
      setDesigns(JSON.parse(item));
    }
  }, []);

  const onSelect = (name) => {
    const item = localStorage.getItem(name);
    if (item) {
      const nextDesign = JSON.parse(item);
      upgradeDesign(nextDesign);
      onChange({
        design: nextDesign,
        selected: getInitialSelected(nextDesign),
      });
      onClose();
    }
  }

  const onReset = () => {
    localStorage.removeItem('selected');
    localStorage.removeItem('activeDesign');
    onChange({ ...resetState(bare), theme: grommet });
    onClose();
  }

  const onDelete = (name) => {
    setConfirmDelete(undefined);
    const nextDesigns = designs.filter(n => n !== name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    localStorage.removeItem(name);
    setDesigns(nextDesigns);
    if (design.name === name) {
      localStorage.removeItem('selected');
      localStorage.removeItem('activeDesign');
      onChange({ ...resetState(bare), theme: grommet });
    }
  }

  return (
    <Action label="designs" onClose={onClose} full>
      <Grid fill="horizontal" columns="small" rows="small" gap="large">
        <Box fill round="medium" >
          <Button fill label="New" onClick={onReset} />
        </Box>
        {designs.map(name => (
          <Stack key={name} fill anchor="bottom-right">
            <Box fill round="medium" overflow="hidden">
              <Button fill plain onClick={() => onSelect(name)}>
                {({ hover }) => (
                  <Box
                    fill
                    pad="medium"
                    background={hover ? 'light-1' : nameToBackground(name)}
                    align="center"
                    justify="center"
                  >
                    <Text textAlign="center" weight="bold">{name}</Text>
                  </Box>
                )}
              </Button>
            </Box>
            <Box direction="row" gap="small">
              {confirmDelete === name && (
                <ActionButton
                  icon={<Trash color="status-critical" />}
                  hoverIndicator
                  onClick={() => onDelete(name)}
                />
              )}
              <ActionButton
                icon={<Trash color="dark-3" />}
                hoverIndicator
                onClick={() => setConfirmDelete(name)}
              />
            </Box>
          </Stack>
        ))}
        <Box
          fill
          round="medium"
          overflow="hidden"
          border={{ side: 'all', color: 'dark-3', size: 'medium' }}
        >
          <Stack fill guidingChild="last" interactiveChild="first">
            <input
              style={{ display: 'block', width: '100%', height: '100%' }}
              type="file"
              onChange={(event) => {
                setError(undefined);
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const design = JSON.parse(reader.result);
                    const selected = getInitialSelected(design);
                    onChange({ design, selected });
                    onClose();
                  } catch (e) {
                    setError(e.message);
                  }
                };
                reader.readAsText(event.target.files[0]);
              }}
            />
            <Box
                fill
                background="dark-1"
                align="center"
                justify="center"
              >
                <Text>Import</Text>
                {error && (
                  <Box background="status-critical" pad="medium">
                    <Text>{error}</Text>
                  </Box>
                )}
              </Box>
          </Stack>
        </Box>
      </Grid>
    </Action>
  );
};

export default Designs;
