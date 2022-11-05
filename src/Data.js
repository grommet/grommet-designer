import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { getData, removeData, setDataProperty, useData } from './design2';
import SelectionContext from './SelectionContext';

const dataToString = (data) => JSON.stringify(data?.data, null, 2) || '';

const Data = ({ id }) => {
  const [, setSelection] = useContext(SelectionContext);
  const data = useData(id);

  // we keep the latest text in a ref so parseAndSet can use it lazily
  const text = useRef(dataToString(data));

  // dataText tracks what the TextArea contains, which might not be valid JSON
  // as the user types
  const [dataText, setDataText] = useState(text.current);

  // any errors parsing the JSON are save here so they can be shown to the user
  const [error, setError] = useState(false);

  const parseAndSet = useCallback(() => {
    if (text.current) {
      try {
        const nextValue = JSON.parse(text.current);
        setError(false);
        setDataProperty(id, 'data', nextValue);
      } catch (e) {
        setError(e.message);
      }
    } else {
      setDataProperty(id, 'data', undefined);
    }
  }, [id]);

  // when data changes, set and reset. This could be due to the user navigating
  // between different data ids.
  useEffect(() => {
    setDataText(dataToString(getData(id)));
    return () => parseAndSet();
  }, [id, parseAndSet]);

  // lazily parse and set to ride out user typing
  useEffect(() => {
    text.current = dataText;
    const timer = setTimeout(() => parseAndSet(), 500);
    return () => clearTimeout(timer);
  }, [dataText, parseAndSet]);

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
              value={dataText}
              rows={40}
              onChange={(event) => setDataText(event.target.value)}
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
