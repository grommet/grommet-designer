import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Header,
  Page,
  PageContent,
  TextArea,
  TextInput,
} from 'grommet';
import { Trash } from 'grommet-icons';
import Field from './components/Field';
import { removeData, setDataProperty, useData } from './design2';
import SelectionContext from './SelectionContext';

const Data = ({ id }) => {
  const [, setSelection] = useContext(SelectionContext);
  const data = useData(id);
  const [json, setJson] = React.useState(
    data ? JSON.stringify(data.data, null, 2) : '',
  );
  useEffect(() => {
    if (data) setJson(JSON.stringify(data.data, null, 2));
  }, [data]);
  const [error, setError] = React.useState(false);

  if (!data) return null;

  return (
    <Page margin={{ vertical: 'medium' }}>
      <PageContent>
        <Header>
          <Field label="name" htmlFor="name" flex="grow">
            <TextInput
              id="name"
              name="name"
              plain
              value={data.name || ''}
              onChange={(event) =>
                setDataProperty(id, 'name', event.target.value)
              }
            />
          </Field>
          <CheckBox
            name="source"
            label="remote"
            checked={data.url !== undefined}
            onChange={(event) => {
              setDataProperty(id, 'url', event.target.checked ? '' : undefined);
            }}
          />
          <Button
            icon={<Trash />}
            hoverIndicator
            tip={`delete ${data.name}`}
            onClick={() => {
              removeData(id);
              setSelection(undefined);
            }}
          />
        </Header>

        <Box margin={{ top: 'medium' }}>
          {data.url !== undefined ? (
            <Field label="url" htmlFor="url">
              <TextInput
                id="url"
                name="url"
                plain
                value={data.url || ''}
                onChange={(event) =>
                  setDataProperty(id, 'url', event.target.value)
                }
              />
            </Field>
          ) : (
            <TextArea
              id="data"
              name="data"
              value={json || ''}
              rows={40}
              onChange={(event) => {
                const value = event.target.value;
                setJson(value);
                if (value) {
                  try {
                    const nextJson = JSON.parse(value);
                    setError(false);
                    setDataProperty(id, 'data', nextJson);
                  } catch (e) {
                    setError(e.message);
                  }
                } else {
                  setDataProperty(id, 'data', undefined);
                }
              }}
            />
          )}
          {error && (
            <Box
              background={{ color: 'status-critical', opacity: 'medium' }}
              pad="small"
            >
              {error}
            </Box>
          )}
        </Box>
      </PageContent>
    </Page>
  );
};

export default Data;
