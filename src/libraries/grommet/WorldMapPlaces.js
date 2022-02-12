import React from 'react';
import { Box, FormField, Heading, Select, TextInput } from 'grommet';
import useDebounce from './useDebounce';
import ArrayOfObjects from './ArrayOfObjects';

const Place = ({ ComponentInput, value, onChange, ...rest }) => {
  const [place, setPlace] = useDebounce(value, onChange);

  return (
    <Box flex="grow" align="end">
      <Box flex="grow">
        <FormField label="name">
          <TextInput
            value={place.name || ''}
            onChange={(event) => {
              const nextPlace = JSON.parse(JSON.stringify(place));
              nextPlace.name = event.target.value;
              setPlace(nextPlace);
            }}
          />
        </FormField>
        <FormField label="location">
          <TextInput
            placeholder="latitude"
            value={place.location?.[0] || ''}
            onChange={(event) => {
              const nextPlace = JSON.parse(JSON.stringify(place));
              if (!nextPlace.location) nextPlace.location = [];
              let lat = parseFloat(event.target.value, 10);
              nextPlace.location[0] =
                `${lat}` === (event.target.value !== '')
                  ? lat
                  : event.target.value;
              setPlace(nextPlace);
            }}
          />
          <TextInput
            placeholder="longitude"
            value={place.location?.[1] || ''}
            onChange={(event) => {
              const nextPlace = JSON.parse(JSON.stringify(place));
              if (!nextPlace.location) nextPlace.location = [];
              let lon = parseFloat(event.target.value, 10);
              nextPlace.location[1] =
                `${lon}` === (event.target.value !== '')
                  ? lon
                  : event.target.value;
              setPlace(nextPlace);
            }}
          />
        </FormField>
        <FormField label="color">
          <TextInput
            value={place.color || ''}
            onChange={(event) => {
              const nextPlace = JSON.parse(JSON.stringify(place));
              nextPlace.color = event.target.value;
              setPlace(nextPlace);
            }}
          />
        </FormField>
        <FormField label="content">
          <ComponentInput
            {...rest}
            name="content"
            value={place.content}
            onChange={(id, nextDesign) => {
              const nextPlace = JSON.parse(JSON.stringify(place));
              if (id) nextPlace.content = id;
              else delete nextPlace.content;
              onChange(nextPlace, nextDesign);
            }}
          />
        </FormField>
        {place.content && (
          <>
            <Heading level={3} size="small">
              dropProps
            </Heading>
            <FormField label="align top">
              <Select
                name="align-top"
                options={['top', 'bottom', 'undefined']}
                value={place.dropProps?.align?.top || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (!nextPlace.dropProps.align)
                    nextPlace.dropProps.align = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.align.top;
                  else nextPlace.dropProps.align.top = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="align bottom">
              <Select
                name="align-bottom"
                options={['top', 'bottom', 'undefined']}
                value={place.dropProps?.align?.bottom || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (!nextPlace.dropProps.align)
                    nextPlace.dropProps.align = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.align.bottom;
                  else nextPlace.dropProps.align.bottom = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="align left">
              <Select
                name="align-left"
                options={['left', 'right', 'undefined']}
                value={place.dropProps?.align?.left || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (!nextPlace.dropProps.align)
                    nextPlace.dropProps.align = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.align.left;
                  else nextPlace.dropProps.align.left = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="align right">
              <Select
                name="align-right"
                options={['left', 'right', 'undefined']}
                value={place.dropProps?.align?.right || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (!nextPlace.dropProps.align)
                    nextPlace.dropProps.align = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.align.right;
                  else nextPlace.dropProps.align.right = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="elevation">
              <Select
                name="elevation"
                options={['xsmall', 'small', 'medium', 'large', 'xlarge']}
                value={place.dropProps?.elevation || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  nextPlace.dropProps.elevation = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="margin horizontal">
              <Select
                name="margin-horizontal"
                options={[
                  'xsmall',
                  'small',
                  'medium',
                  'large',
                  'xlarge',
                  'undefined',
                ]}
                value={place.dropProps?.margin?.horizontal || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (
                    !nextPlace.dropProps.margin ||
                    typeof nextPlace.dropProps.margin !== 'object'
                  )
                    nextPlace.dropProps.margin = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.margin.horizontal;
                  else nextPlace.dropProps.margin.horizontal = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="margin vertical">
              <Select
                name="margin-vertical"
                options={[
                  'xsmall',
                  'small',
                  'medium',
                  'large',
                  'xlarge',
                  'undefined',
                ]}
                value={place.dropProps?.margin?.vertical || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  if (
                    !nextPlace.dropProps.margin ||
                    typeof nextPlace.dropProps.margin !== 'object'
                  )
                    nextPlace.dropProps.margin = {};
                  if (option === 'undefined')
                    delete nextPlace.dropProps.margin.vertical;
                  else nextPlace.dropProps.margin.vertical = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
            <FormField label="round">
              <Select
                name="round"
                options={['xsmall', 'small', 'medium', 'large', 'xlarge']}
                value={place.dropProps?.round || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  nextPlace.dropProps.round = option;
                  setPlace(nextPlace);
                }}
              />
            </FormField>
          </>
        )}
      </Box>
    </Box>
  );
};

const WorldMapPlaces = (props) => (
  <ArrayOfObjects
    name="places"
    labelKey="name"
    Edit={Place}
    defaultObject={{ location: [] }}
    {...props}
  />
);

export default WorldMapPlaces;
