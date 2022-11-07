import React from 'react';
import ReactGA from 'react-ga';
import { Button, Paragraph } from 'grommet';
import { useDesign } from '../design2';
import Action from '../components/Action';

const Export = ({ onClose }) => {
  const design = useDesign();
  return (
    <Action label="export" animation="fadeIn" onClose={onClose}>
      <Paragraph>
        Export the design to a JSON file. You can use this as a separate backup
        copy, inspect and transform it with a program, or share it with someone
        else. You can import it via the top left control that shows all of your
        designs.
      </Paragraph>
      <Button
        label="Export"
        primary
        hoverIndicator
        alignSelf="start"
        href={`data:application/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(design),
        )}`}
        download={`${design.name || 'design'}.json`}
        onClick={() => {
          onClose();
          ReactGA.event({
            category: 'share',
            action: 'export design',
          });
        }}
      />
    </Action>
  );
};

export default Export;
