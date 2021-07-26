import React, { useContext, useEffect, useState } from 'react';
import { Button, Header, Heading, Layer, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import DesignContext from '../DesignContext';
import { generateJSX } from '../design';

const ComponentCode = ({ component, onDone }) => {
  const { design, imports, theme } = useContext(DesignContext);
  const [code, setCode] = useState();
  useEffect(() => {
    setCode(generateJSX({ component, design, imports, theme }));
  }, [component, design, imports, theme]);
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
