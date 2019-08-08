import React from 'react';
import { Box, Button, Grid, Heading, Stack, Text, grommet } from 'grommet';
import { Trash } from 'grommet-icons';
import {
  apiUrl, bare, getInitialSelected, resetState, upgradeDesign,
} from '../design';
import Action from '../components/Action';
import ActionButton from '../components/ActionButton';

const standardDesigns = [
  {
    name: 'Navigation Patterns',
    id: 'Navigation-Patterns-eric-soderberg-hpe-com',
  },
  {
    name: 'Card',
    id: 'Card-eric-soderberg-hpe-com',
  }
];

const nameToBackground = (name) => {
  let num = 0;
  for (let i = 0; i < name.length; i++) {
    num += name.charCodeAt(i);
  }
  return `accent-${(num % 4) + 1}`;
};

const Design = ({ name, loading, onClick }) => (
  <Box fill round="medium" overflow="hidden" animation={loading ? 'pulse' : undefined}>
    <Button fill plain onClick={onClick}>
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
);

const Designs = ({ design, onClose, onChange }) => {
  const [designs, setDesigns] = React.useState([]);
  const [error, setError] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();
  const [loading, setLoading] = React.useState();

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

  const onLoad = (id) => {
    setLoading(id);
    fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .then((nextDesign) => {
        upgradeDesign(nextDesign);
        onChange({
          design: nextDesign,
          selected: getInitialSelected(nextDesign),
        });
        onClose();
      })
      .catch(() => setLoading(undefined));
  }

  return (
    <Action label="designs" onClose={onClose} full="horizontal">
      <Heading level={2}>My Designs</Heading>
      <Grid fill="horizontal" columns="small" rows="xsmall" gap="large">
        <Box fill round="medium" >
          <Button fill label="New" onClick={onReset} />
        </Box>
        {designs.map(name => (
          <Stack key={name} fill anchor="bottom-right">
            <Design name={name} onClick={() => onSelect(name)} />
            <Box direction="row" gap="small">
              {confirmDelete === name && (
                <ActionButton
                  title="confirm delete"
                  icon={<Trash color="status-critical" />}
                  hoverIndicator
                  onClick={() => onDelete(name)}
                />
              )}
              <ActionButton
                title="delete design"
                icon={<Trash color="dark-3" />}
                hoverIndicator
                onClick={() =>
                  setConfirmDelete(confirmDelete === name ? undefined : name)}
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
      <Box alignSelf="stretch" border="top" margin={{ top: 'large' }}>
        <Heading level={2}>Starter Designs</Heading>
        <Grid fill="horizontal" columns="small" rows="xsmall" gap="large">
          {standardDesigns.map(({ name, id }) => (
            <Design
              key={id}
              name={name}
              loading={loading === id}
              onClick={() => onLoad(id)}
            />
          ))}
        </Grid>
      </Box>
    </Action>
  );
};

export default Designs;
