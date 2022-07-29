import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const InlineInput = styled.input`
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  border: none;
  -webkit-appearance: none;
  background: transparent;
  color: inherit;
  font-weight: inherit;
  text-align: inherit;
  margin: 0;
  padding: 0;
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`;

const InlineEditInput = ({
  as,
  placeholder,
  defaultValue,
  onChange,
  onDone,
  size,
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef();

  // set focus when editing inline
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <InlineInput
      ref={inputRef}
      as={as}
      placeholder={placeholder}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange(event.target.value);
      }}
      onClick={(event) => event.stopPropagation()}
      // don't let Enter trigger onClick in ancestors
      onKeyDown={(event) => event.stopPropagation()}
      onBlur={() => onDone()}
      style={{
        width: size.width,
        height: size.height,
        minWidth: 48,
      }}
    />
  );
};

export default InlineEditInput;
