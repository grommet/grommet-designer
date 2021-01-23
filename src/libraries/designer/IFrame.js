import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledIFrame = styled.iframe`
  border: none;
`;

const IFrame = ({ src, title }) => {
  const [dimensions, setDimensions] = useState([100, 100]);
  const ref = useRef();
  useEffect(() => {
    const align = () => {
      const { width, height } = ref.current.parentNode.getBoundingClientRect();
      if (width !== dimensions[0] || height !== dimensions[1]) {
        setDimensions([width, height]);
      }
    };

    window.addEventListener('resize', align);
    align();
    return () => window.removeEventListener('resize', align);
  }, [dimensions]);

  return (
    <StyledIFrame
      ref={ref}
      title={title}
      width={dimensions[0]}
      height={dimensions[1]}
      src={src}
    />
  );
};

export default IFrame;
