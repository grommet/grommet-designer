import React, { useEffect, useState } from 'react';
import { Button, Header, Heading, Layer, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import { generateJSX } from '../design';

const ComponentCode = ({ id, onDone }) => {
  const [code, setCode] = useState();
  useEffect(() => setCode(generateJSX(id)), [id]);
  return (
    <Layer onClickOutside={onDone} onEsc={onDone}>
      <Header>
        <Heading
          level={2}
          size="small"
          margin={{ vertical: 'none', horizontal: 'medium' }}
        >
          code
        </Heading>
        <Button icon={<Close />} onClick={onDone} />
      </Header>
      <TextArea value={code} rows={20} cols={40} readOnly />
    </Layer>
  );
};

export default ComponentCode;
