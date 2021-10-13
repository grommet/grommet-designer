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
                `${lat}` === event.target.value ? lat : event.target.value;
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
                `${lon}` === event.target.value ? lon : event.target.value;
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
            <FormField label="align">
              <Select
                name="align-from"
                options={['top', 'bottom', 'left', 'right']}
                value={
                  (place.dropProps && Object.keys(place.dropProps?.align)[0]) ||
                  ''
                }
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  nextPlace.dropProps.align = { [option]: option };
                  setPlace(nextPlace);
                }}
              />
              {place.dropProps?.align && (
                <Select
                  name="align-to"
                  options={['top', 'bottom', 'left', 'right']}
                  value={Object.values(place.dropProps?.align)[0] || ''}
                  onChange={({ option }) => {
                    const nextPlace = JSON.parse(JSON.stringify(place));
                    nextPlace.dropProps.align[
                      Object.keys(nextPlace.dropProps.align)[0]
                    ] = option;
                    setPlace(nextPlace);
                  }}
                />
              )}
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
            <FormField label="margin">
              <Select
                name="margin"
                options={['xsmall', 'small', 'medium', 'large', 'xlarge']}
                value={place.dropProps?.margin || ''}
                onChange={({ option }) => {
                  const nextPlace = JSON.parse(JSON.stringify(place));
                  if (!nextPlace.dropProps) nextPlace.dropProps = {};
                  nextPlace.dropProps.margin = option;
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
