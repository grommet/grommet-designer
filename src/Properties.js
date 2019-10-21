import React, { Fragment } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Heading,
  Keyboard,
  Paragraph,
  Select,
  TextArea,
  TextInput,
} from 'grommet';
import { Duplicate, Refresh, Trash } from 'grommet-icons';
import Property from './Property';
import {
  deleteComponent,
  duplicateComponent,
  getDisplayName,
  getLinkOptions,
} from './design';
import ActionButton from './components/ActionButton';
import Field from './components/Field';
import { getComponentType } from './utils';

export default ({
  colorMode,
  component,
  design,
  libraries,
  selected,
  theme,
  setDesign,
  setSelected,
}) => {
  const [search, setSearch] = React.useState();

  const searchRef = React.useRef();
  const defaultRef = React.useRef();

  React.useEffect(() => setSearch(undefined), [component.id]);

  React.useEffect(() => {
    if (search !== undefined) searchRef.current.focus();
  }, [search]);

  const setProp = (propName, value) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    if (value !== undefined) component.props[propName] = value;
    else delete component.props[propName];
    setDesign(nextDesign);
  };

  const setText = text => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.text = text;
    setDesign(nextDesign);
  };

  const setName = name => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.name = name;
    setDesign(nextDesign);
  };

  const link = to => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.linkTo = to;
    setDesign(nextDesign);
  };

  const setHide = hide => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.hide = hide;
    setDesign(nextDesign);
  };

  const reset = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.props = {};
    setDesign(nextDesign);
  };

  const duplicate = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const newId = duplicateComponent(nextDesign, selected.component);
    setDesign(nextDesign);
    setSelected({ ...selected, component: newId });
  };

  const delet = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const parentId = deleteComponent(nextDesign, selected.component);
    setDesign(nextDesign);
    setSelected({ ...selected, component: parentId });
  };

  const onKey = event => {
    if (document.activeElement === document.body) {
      if (event.key === 'Backspace' && event.metaKey) {
        event.preventDefault();
        delet();
      }
      if (event.key === 'p') {
        event.preventDefault(); // so we don't put the 'p' in the search input
        if (search === undefined) {
          setSearch('');
        } else {
          searchRef.current.focus();
        }
      }
      if (event.key === 'd') {
        event.preventDefault();
        duplicate();
      }
    } else if (document.activeElement === searchRef.current) {
      if (event.key === 'Enter' && search && defaultRef.current) {
        event.preventDefault(); // so we don't put the Enter in the input
        // focus on first matching property
        defaultRef.current.focus();
      }
    }
  };

  const type = getComponentType(libraries, component.type) || {};
  let linkOptions;
  if (type.name === 'Button') {
    // options for what the button should do:
    // open a layer, close the layer it is in, change screens,
    linkOptions = getLinkOptions(design, selected);
  }

  const searchExp = search && new RegExp(`^${search}`, 'i');
  let firstRef = false;

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box
        background={colorMode === 'dark' ? 'dark-1' : 'white'}
        height="100vh"
        border="left"
      >
        <Box
          flex={false}
          direction="row"
          align="center"
          justify="between"
          border="bottom"
        >
          <Box flex alignSelf="stretch">
            <Button
              title="documentation"
              fill
              hoverIndicator
              target="_blank"
              href={type.documentation}
            >
              <Box fill pad="small">
                <Heading level={2} size="18px" margin="none" truncate>
                  {type.name}
                </Heading>
              </Box>
            </Button>
          </Box>
          {component.deletable !== false && (
            <Box flex={false} direction="row" align="center">
              <ActionButton title="reset" icon={<Refresh />} onClick={reset} />
              <ActionButton
                title="duplicate"
                icon={<Duplicate />}
                onClick={duplicate}
              />
              <ActionButton title="delete" icon={<Trash />} onClick={delet} />
            </Box>
          )}
        </Box>

        {search !== undefined && (
          <Box flex={false} border="bottom">
            <TextInput
              ref={searchRef}
              placeholder="search properties ..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </Box>
        )}

        <Box flex overflow="auto">
          <Box flex="grow">
            <Box>
              {type.help && (
                <Box pad={{ horizontal: 'medium' }} border="bottom">
                  <Paragraph>{type.help}</Paragraph>
                </Box>
              )}
              {type.name !== 'Reference' &&
                (!searchExp || searchExp.test('name')) && (
                  <Field label="name">
                    <TextInput
                      ref={searchExp && !firstRef ? defaultRef : undefined}
                      plain
                      name="name"
                      value={component.name || ''}
                      onChange={event => setName(event.target.value)}
                      style={{ textAlign: 'end' }}
                    />
                    {(firstRef = true)}
                  </Field>
                )}
              {type.text && (!searchExp || searchExp.test('text')) && (
                <Field label="text">
                  <TextArea
                    ref={searchExp && !firstRef ? defaultRef : undefined}
                    plain
                    value={component.text || type.text}
                    onChange={event => setText(event.target.value)}
                  />
                  {(firstRef = true)}
                </Field>
              )}
              {type.name === 'Button' &&
                linkOptions.length > 1 &&
                (!searchExp || searchExp.test('link to')) && (
                  <Field label="link to" htmlFor="linkTo">
                    <Select
                      ref={searchExp && !firstRef ? defaultRef : undefined}
                      id="linkTo"
                      name="linkTo"
                      plain
                      options={linkOptions}
                      value={component.linkTo || ''}
                      onChange={({ option }) =>
                        link(option ? option : undefined)
                      }
                      valueLabel={
                        component.linkTo ? (
                          <Box pad="small">
                            {getDisplayName(design, component.linkTo.component)}
                          </Box>
                        ) : (
                          undefined
                        )
                      }
                    >
                      {option => (
                        <Box pad="small">
                          {option
                            ? getDisplayName(design, option.component)
                            : 'clear'}
                        </Box>
                      )}
                    </Select>
                    {(firstRef = true)}
                  </Field>
                )}
              {type.name === 'Layer' && (!searchExp || searchExp.test('hide')) && (
                <Field label="hide">
                  <Box pad="small">
                    <CheckBox
                      ref={searchExp && !firstRef ? defaultRef : undefined}
                      toggle
                      checked={!!component.hide}
                      onChange={() => setHide(!component.hide)}
                    />
                    {(firstRef = true)}
                  </Box>
                </Field>
              )}
            </Box>

            {type.properties && (
              <Box flex="grow">
                {!Array.isArray(type.properties) && (
                  <Heading
                    level={3}
                    size="small"
                    margin={{ horizontal: 'medium', vertical: 'medium' }}
                  >
                    Properties
                  </Heading>
                )}
                {Array.isArray(type.properties)
                  ? type.properties
                      .filter(
                        ({ properties }) =>
                          !searchExp ||
                          Object.keys(properties).some(propName =>
                            searchExp.test(propName),
                          ),
                      )
                      .map(({ label, properties }) => (
                        <Box key={label} flex={false} margin={{ top: 'small' }}>
                          <Heading
                            level={4}
                            size="small"
                            margin={{
                              horizontal: 'medium',
                              top: 'small',
                              bottom: 'medium',
                            }}
                          >
                            {label}
                          </Heading>
                          {Object.keys(properties)
                            .filter(
                              propName =>
                                !searchExp || searchExp.test(propName),
                            )
                            .filter(
                              propName =>
                                typeof properties[propName] !== 'string' ||
                                !properties[propName].startsWith('-component-'),
                            )
                            .map((propName, index) => (
                              <Fragment key={propName}>
                                <Property
                                  ref={
                                    searchExp && !firstRef
                                      ? defaultRef
                                      : undefined
                                  }
                                  first={index === 0}
                                  design={design}
                                  theme={theme}
                                  selected={selected}
                                  name={propName}
                                  property={properties[propName]}
                                  value={component.props[propName]}
                                  onChange={value => setProp(propName, value)}
                                />
                                {(firstRef = true)}
                              </Fragment>
                            ))}
                          {(firstRef = true)}
                        </Box>
                      ))
                  : Object.keys(type.properties)
                      .filter(
                        propName => !searchExp || searchExp.test(propName),
                      )
                      .filter(
                        propName =>
                          typeof type.properties[propName] !== 'string' ||
                          !type.properties[propName].startsWith('-component-'),
                      )
                      .map((propName, index) => (
                        <Fragment key={propName}>
                          <Property
                            ref={
                              searchExp && !firstRef ? defaultRef : undefined
                            }
                            first={index === 0}
                            design={design}
                            theme={theme}
                            selected={selected}
                            name={propName}
                            property={type.properties[propName]}
                            value={component.props[propName]}
                            onChange={value => setProp(propName, value)}
                          />
                          {(firstRef = true)}
                        </Fragment>
                      ))}

                <Box flex />

                {(!searchExp || searchExp.test('style')) && (
                  <Field label="style" first margin={{ top: 'large' }}>
                    <TextArea
                      ref={searchExp && !firstRef ? defaultRef : undefined}
                      name="style"
                      rows={2}
                      plain
                      value={
                        component.props.styling ||
                        (component.props.style &&
                          JSON.stringify(component.props.style, null, 2)) ||
                        ''
                      }
                      onChange={event => {
                        setProp('styling', event.target.value);
                        try {
                          const json = JSON.parse(event.target.value);
                          setProp('style', json);
                        } catch (e) {
                          // console.log('!!! catch');
                        }
                      }}
                    />
                    {(firstRef = true)}
                  </Field>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Keyboard>
  );
};
