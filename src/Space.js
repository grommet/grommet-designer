import React, { useEffect, useMemo, useState } from 'react';
import { Box, Header, Heading, Meter, Text, Tip } from 'grommet';
import friendlyState from './friendlyState';

const starter = {
  cached: { value: 0, color: 'graph-0', label: 'Cached' },
  unpublished: { value: 0, color: 'graph-1', label: 'Unpublished' },
  changed: { value: 0, color: 'status-warning', label: 'Unpublished changes' },
  published: { value: 0, color: 'graph-2', label: 'Published' },
  orphaned: { value: 0, color: 'status-critical', label: 'Orphaned' },
  designer: { value: 0, color: 'text-xweak', label: 'Designer internal' },
  unknown: { value: 0, color: 'status-unknown', label: 'Unknown' },
};

const Space = () => {
  const [values, setValues] = useState(
    Object.values(JSON.parse(JSON.stringify(starter))),
  );
  const [active, setActive] = useState();

  useEffect(() => {
    const next = JSON.parse(JSON.stringify(starter));
    Object.keys(localStorage).forEach((key) => {
      const stored = localStorage.getItem(key);
      const size = stored.length;
      let sizeKey = 'unknown';
      if (key === 'designs') sizeKey = 'designer';
      else if (key.endsWith('--state') || key.endsWith('--identity'))
        sizeKey = 'designer';
      else {
        try {
          const design = JSON.parse(stored);
          sizeKey = friendlyState(key, design) || 'unknown';
        } catch (e) {
          sizeKey = 'unknown';
        }
      }
      next[sizeKey].value += size;

      if (size > 1024 * 100) {
        if (!next[sizeKey].big) next[sizeKey].big = [];
        next[sizeKey].big.push({ key, size });
      }
    });

    // convert to K and add interaction
    Object.values(next)
      .filter((v) => v.value)
      .forEach((v) => {
        v.value = Math.round(v.value / 1024);
        v.onHover = (over) => setActive((over && v) || undefined);
      });

    setValues(Object.values(next));
  }, []);

  const max = useMemo(() => {
    let total = 0;
    values.forEach((v) => (total += v.value));
    return total;
  }, [values]);

  return (
    <Box margin={{ vertical: 'medium' }} gap="medium">
      <Heading level={2} size="small" margin="none">
        storage
      </Heading>
      <Box direction="row" gap="medium" align="center">
        <Tip
          content={
            active ? (
              <Box pad="small" gap="small">
                <Header>
                  <Box direction="row" gap="small" align="center">
                    <Box pad="xsmall" background={active.color} />
                    <Heading level={3} size="small" margin="none">
                      {active.label}
                    </Heading>
                  </Box>
                  <Text>{active.value} K</Text>
                </Header>
                <Box pad={{ start: 'medium' }}>
                  {active.big?.map((b) => (
                    <Box
                      direction="row"
                      gap="medium"
                      justify="between"
                      align="top"
                    >
                      <Text weight="bold">{b.key}</Text>
                      <Text wordBreak="keep-all">
                        {Math.round(b.size / 1024)} K
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : undefined
          }
        >
          <Meter values={values} max={max} />
        </Tip>
        <Text>{`${max} K total`}</Text>
      </Box>
    </Box>
  );
};

export default Space;
