import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Box, Button, Markdown, Paragraph, TextArea } from 'grommet';
import { dependencies, generateJSX } from '../design';
import Action from '../components/Action';

const GenerateCode = ({ onClose }) => {
  const [code, setCode] = useState();
  return (
    <Action label="generate code" animation="fadeIn" onClose={onClose}>
      <Paragraph>
        Turn your design into real code that you can use to create a live site.
        While some development knowledge is required, here is some guidance to
        get you started.
      </Paragraph>
      {!code && (
        <Button
          label="Generate Code"
          primary
          hoverIndicator
          alignSelf="start"
          onClick={() => {
            setCode(generateJSX());
            ReactGA.event({
              category: 'share',
              action: 'generate code',
            });
          }}
        />
      )}
      {code && (
        <Box>
          <Markdown>
            {`
* install nodejs, npm, yarn, and create-react-app (if needed)
* \`# npx create-react-app my-app\`
* \`# cd my-app\`
* \`# yarn add ${dependencies().join(' ')}\`
* replace the contents of \`src/App.js\` with the text below
* \`# yarn start\`
            `}
          </Markdown>
          <TextArea value={code} rows={20} cols={40} readOnly />
        </Box>
      )}
    </Action>
  );
};

export default GenerateCode;
