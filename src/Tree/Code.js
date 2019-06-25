import React from 'react';
import { Box, Markdown, TextArea } from 'grommet';
import Action from './Action';
import { generateJSX } from '../design';

const Code = ({ design, onChange, onClose }) => {
  const code = generateJSX(design);

  return (
    <Action onClose={onClose}>
      <Box>
        <Markdown>{`
* install nodejs, npm, yarn, and create-react-app (if needed)
* \`# create-react-app my-app\`
* \`# cd my-app\`
* \`# yarn add grommet grommet-icons styled-components\`
* replace the contents of \`src/App.js\` with the text below
* \`# yarn start\`
          `}
        </Markdown>
        <TextArea value={code} rows={20} cols={40} readOnly />
      </Box>
    </Action>
  );
};

export default Code;
