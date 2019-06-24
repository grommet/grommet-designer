import React from 'react';
import { Box, Button } from 'grommet';
import { Trash } from 'grommet-icons';
import Action from './Action';
import { upgradeDesign } from '../designs';

const Designs = ({ design, onClose, onChange }) => {
  const [designs, setDesigns] = React.useState([]);

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
      onChange({ design: nextDesign });
      onClose();
    }
  }

  const onDelete = (name) => {
    const nextDesigns = designs.filter(n => n !== name);
    localStorage.setItem('designs', JSON.stringify(nextDesigns));
    localStorage.removeItem(name);
    setDesigns(nextDesigns);
  }

  return (
    <Action onClose={onClose}>
      <Box>
        {designs.map(name => (
          <Box
            key={name}
            direction="row"
            align="center"
            justify="between"
          >
            <Box flex="grow">
              <Button
                hoverIndicator
                onClick={() => onSelect(name)}
              >
                <Box pad="small">{name}</Box>
              </Button>
            </Box>
            <Button
              icon={<Trash />}
              hoverIndicator
              onClick={() => onDelete(name)}
            />
          </Box>
        ))}
      </Box>
    </Action>
  );
};

export default Designs;
