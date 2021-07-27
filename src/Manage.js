import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Header,
  Heading,
  Layer,
  List,
  Paragraph,
  Text,
} from 'grommet';
import { Archive, Close } from 'grommet-icons';

const add = (buckets, name, design) => {
  if (!buckets[name]) buckets[name] = [];
  buckets[name].push(design);
};

const Section = ({ heading, instructions, designs, onOffloaded }) => (
  <Box as="section" flex={false} margin={{ bottom: 'medium' }}>
    <Heading level={3} size="small">
      {heading}
    </Heading>
    <Paragraph>{instructions}</Paragraph>
    <List data={designs} pad="none">
      {(design) => (
        <Box
          direction="row"
          align="center"
          justify="between"
          pad={{ start: 'medium' }}
        >
          <Text weight="bold">{design.name}</Text>
          <Box direction="row" align="center" gap="small">
            <Text>{`${Math.floor(design.size / 1024)} K`}</Text>
            {onOffloaded ? (
              <Button
                icon={<Archive />}
                tip="Offload"
                hoverIndicator
                onClick={() => {
                  // replace full design with a minimal one that has just
                  // enough to load it from the published version later
                  const offloadedDesign = {
                    name: design.name,
                    id: design.id,
                    publishedUrl: design.publishedUrl,
                    size: design.size,
                  };
                  localStorage.setItem(
                    offloadedDesign.name,
                    JSON.stringify(offloadedDesign),
                  );
                  design.size = '0';
                  delete design.modified;
                  onOffloaded(design.name);
                }}
              />
            ) : (
              <Box pad="medium" />
            )}
          </Box>
        </Box>
      )}
    </List>
  </Box>
);

const Manage = ({ onClose }) => {
  const [buckets, setBuckets] = useState({});

  // organize designs into buckets
  useEffect(() => {
    const stored = localStorage.getItem('designs');
    if (stored) {
      const nextBuckets = {};
      JSON.parse(stored)
        .sort((n1, n2) => n1.localeCompare(n2))
        .forEach((n) => {
          const stored2 = localStorage.getItem(n);
          const { id, modified, name, publishedUrl, screens, size } =
            JSON.parse(stored2);
          const design = {
            id,
            name,
            publishedUrl,
            size: size || stored2.length,
          };
          if (publishedUrl) {
            if (!screens) {
              add(nextBuckets, 'offloaded', design);
            } else if (modified === false) {
              add(nextBuckets, 'offloadable', design);
            } else if (modified === true) {
              add(nextBuckets, 'modified', design);
            } else {
              add(nextBuckets, 'older', design);
            }
          } else {
            add(nextBuckets, 'local', design);
          }
        });
      setBuckets(nextBuckets);
    }
  }, []);

  return (
    <Layer margin="medium">
      <Header pad={{ left: 'medium' }}>
        <Heading level={2} size="small" margin="none">
          my designs
        </Heading>
        <Button icon={<Close />} hoverIndicator onClick={onClose} />
      </Header>
      <Box flex overflow="auto" margin="small">
        <Box flex={false} margin="medium">
          <Paragraph>
            Your designs are stored in browser local storage, which has limited
            space.
          </Paragraph>
          {buckets.offloadable && (
            <Section
              heading="offloadable"
              instructions={`You can offload these designs you have
              published and not modified to reclaim local storage space.`}
              designs={buckets.offloadable}
              onOffloaded={(name) => {
                // move to offloaded bucket
                const index = buckets.offloadable.findIndex(
                  (d) => d.name === name,
                );
                const design = buckets.offloadable[index];
                console.log('!!! onOffloaded', buckets, index, design);
                buckets.offloadable.splice(index, 1);
                if (!buckets.offloaded) buckets.offloaded = [];
                buckets.offloaded.push(design);
                setBuckets({ ...buckets });
              }}
            />
          )}
          {buckets.modified && (
            <Section
              heading="locally modified"
              instructions={`You have previously published these designs but
              they have since been modified locally. If you re-publish them
              you will be able to offload them.`}
              designs={buckets.modified}
            />
          )}
          {buckets.offloaded && (
            <Section
              heading="offloaded"
              instructions={`These designs have already been offloaded.`}
              designs={buckets.offloaded}
            />
          )}
          {buckets.older && (
            <Section
              heading="older"
              instructions={`These designs are from a prior version
              of the designer and we cannot tell if they can be offloaded.
              If you publish them again you will be able to offload them.`}
              designs={buckets.older}
            />
          )}
          {buckets.local && (
            <Section
              heading="local only"
              instructions={`hese designs have never been published.`}
              designs={buckets.local}
            />
          )}
        </Box>
      </Box>
    </Layer>
  );
};

export default Manage;
