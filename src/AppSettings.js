import React, { useContext } from 'react';
import { Box, CheckBox, RadioButtonGroup } from 'grommet';
import AppContext from './AppContext';
import Action from './components/Action';
import Field from './components/Field';

const AppSettings = ({ onClose }) => {
  const { direction, setDirection, themeMode, setThemeMode } =
    useContext(AppContext);
  return (
    <Action label="settings" onClose={onClose}>
      <Box flex={false} gap="medium">
        <Field label="Appearance" htmlFor="themeMode">
          <RadioButtonGroup
            id="themeMode"
            name="themeMode"
            direction="row"
            gap="medium"
            options={['dark', 'light', 'auto']}
            pad="medium"
            value={themeMode || ''}
            onChange={(event) => setThemeMode(event.target.value)}
          />
        </Field>

        <Field label="Direction" htmlFor="direction">
          <CheckBox
            id="direction"
            name="direction"
            label="right to left"
            toggle
            pad="medium"
            checked={direction === 'rtl' || false}
            onChange={(event) =>
              setDirection(event.target.checked ? 'rtl' : undefined)
            }
          />
        </Field>
      </Box>
    </Action>
  );
};

export default AppSettings;
