import React from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  CheckBox,
  Grid,
  Heading,
  Meter,
  RadioButtonGroup,
  Stack,
  Text,
} from 'grommet';
import { Trash } from 'grommet-icons';
import styled, { keyframes } from 'styled-components';
import {
  apiUrl,
  bare,
  getInitialSelected,
  setupDesign,
  upgradeDesign,
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
  },
];

const Spinner = styled(Meter)`
  animation: ${keyframes`from {
    transform: rotate(0deg);
} to {
    transform: rotate(360deg);
}`} 3s infinite;
`;

const nameToBackground = name => {
  let num = 0;
  for (let i = 0; i < name.length; i++) {
    num += name.charCodeAt(i);
  }
  return `accent-${(num % 4) + 1}`;
};

const Design = ({ name, loading, onClick }) => (
  <Box fill round="small" overflow="hidden">
    {loading ? (
      <Box
        fill
        align="center"
        justify="center"
        pad="medium"
        background={{ color: nameToBackground(name), opacity: 'medium' }}
      >
        <Spinner
          type="circle"
          size="full"
          thickness="xlarge"
          values={[{ value: 50, color: nameToBackground(name) }]}
        />
      </Box>
    ) : (
      <Button fill plain onClick={onClick}>
        {({ hover }) => (
          <Box
            fill
            pad="medium"
            background={hover ? 'active' : nameToBackground(name)}
            align="center"
            justify="center"
          >
            <Text textAlign="center" weight="bold">
              {name}
            </Text>
          </Box>
        )}
      </Button>
    )}
  </Box>
);

const Designs = ({
  colorMode,
  design,
  rtl,
  onClose,
  setColorMode,
  setDesign,
  setRTL,
  setSelected,
}) => {
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

  const select = name => {
    const item = localStorage.getItem(name);
    if (item) {
      const nextDesign = JSON.parse(item);
      upgradeDesign(nextDesign);
      setDesign(nextDesign);
      setSelected(getInitialSelected(nextDesign));
      onClose();

      ReactGA.event({
        category: 'switch',
        action: 'change design',
      });
    }
  };

  const reset = () => {
    localStorage.removeItem('selected');
    localStorage.removeItem('activeDesign');
    const nextDesign = setupDesign(bare);
    setDesign(nextDesign);
    setSelected(getInitialSelected(nextDesign));
    onClose();

    ReactGA.event({
      category: 'switch',
      action: 'new design',
    });
  };

  const delet = name => {
    setConfirmDelete(undefined);
    const nextDesigns = designs.filter(n => n !== name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    localStorage.removeItem(name);
    setDesigns(nextDesigns);
    if (design.name === name) {
      localStorage.removeItem('selected');
      localStorage.removeItem('activeDesign');
      const nextDesign = setupDesign(bare);
      setDesign(nextDesign);
      setSelected(getInitialSelected(nextDesign));
    }

    ReactGA.event({
      category: 'switch',
      action: 'delete design',
    });
  };

  const load = id => {
    setLoading(id);
    fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .then(nextDesign => {
        upgradeDesign(nextDesign);
        setDesign(nextDesign);
        setSelected(getInitialSelected(nextDesign));
        onClose();

        ReactGA.event({
          category: 'switch',
          action: 'load starter design',
        });
      })
      .catch(() => setLoading(undefined));
  };

  return (
    <Action label="designs" onClose={onClose} full="horizontal">
      <Heading level={2}>My Designs</Heading>
      <Grid fill="horizontal" columns="small" rows="xsmall" gap="large">
        <Box fill round="small">
          <Button fill label="New" onClick={reset} />
        </Box>
        {designs.map(name => (
          <Stack key={name} fill anchor="bottom-right">
            <Design name={name} onClick={() => select(name)} />
            <Box direction="row" gap="small">
              {confirmDelete === name && (
                <ActionButton
                  title="confirm delete"
                  icon={<Trash color="status-critical" />}
                  hoverIndicator
                  onClick={() => delet(name)}
                />
              )}
              <ActionButton
                title="delete design"
                icon={<Trash color="border" />}
                hoverIndicator
                onClick={() =>
                  setConfirmDelete(confirmDelete === name ? undefined : name)
                }
              />
            </Box>
          </Stack>
        ))}
        <Box
          fill
          round="small"
          overflow="hidden"
          border={{ side: 'all', size: 'medium' }}
        >
          <Stack fill guidingChild="last" interactiveChild="first">
            <input
              style={{ display: 'block', width: '100%', height: '100%' }}
              type="file"
              onChange={event => {
                setError(undefined);
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const nextDesign = JSON.parse(reader.result);
                    upgradeDesign(nextDesign);
                    const nextSelected = getInitialSelected(nextDesign);
                    setDesign(nextDesign);
                    setSelected(nextSelected);
                    onClose();

                    ReactGA.event({
                      category: 'switch',
                      action: 'import design',
                    });
                  } catch (e) {
                    setError(e.message);
                  }
                };
                reader.readAsText(event.target.files[0]);
              }}
            />
            <Box fill background="background" align="center" justify="center">
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
              onClick={() => load(id)}
            />
          ))}
        </Grid>
      </Box>
      <Box
        flex={false}
        alignSelf="stretch"
        direction="row"
        justify="end"
        gap="medium"
        margin={{ top: 'medium' }}
      >
        <RadioButtonGroup
          id="themeMode"
          name="themeMode"
          direction="row"
          gap="medium"
          options={['dark', 'light']}
          value={colorMode || ''}
          onChange={event => {
            setColorMode(event.target.value);
          }}
        />
        <CheckBox
          label="right to left"
          checked={rtl || false}
          onChange={() => setRTL(!rtl)}
        />
        <Button
          label="help"
          href="https://github.com/grommet/grommet-designer/blob/master/README.md"
          target="_blank"
        />
      </Box>
    </Action>
  );
};

export default Designs;
