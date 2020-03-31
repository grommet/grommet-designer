import React, { Fragment } from 'react';
import ReactGA from 'react-ga';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Drop,
  Heading,
  Keyboard,
  Markdown,
  Menu,
  Paragraph,
  Text,
  TextInput,
} from 'grommet';
import { Duplicate, Location, Trash } from 'grommet-icons';
import Property from './Property';
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import ComponentCode from './ComponentCode';
import {
  deleteComponent,
  duplicateComponent,
  getLinkOptions,
  getParent,
  getReferences,
  getScreenForComponent,
  newFrom,
} from '../design';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';
import { getComponentType } from '../utils';

export default ({
  component,
  design,
  imports,
  libraries,
  selected,
  theme,
  setDesign,
  setSelected,
}) => {
  const type = React.useMemo(
    () => getComponentType(libraries, component.type) || {},
    [component, libraries],
  );
  const references = React.useMemo(() => getReferences(design, component.id), [
    component,
    design,
  ]);
  const [showReferences, setShowReferences] = React.useState();
  const [showAdvanced, setShowAdvanced] = React.useState();
  const [search, setSearch] = React.useState();
  const searchExp = React.useMemo(() => search && new RegExp(search, 'i'), [
    search,
  ]);
  const linkOptions = React.useMemo(
    () => getLinkOptions(design, libraries, selected),
    [design, libraries, selected],
  );
  const [showCode, setShowCode] = React.useState();

  const searchRef = React.useRef();
  const defaultRef = React.useRef();
  const referencesRef = React.useRef();

  React.useEffect(() => setSearch(undefined), [component.id]);

  React.useEffect(() => {
    if (search !== undefined) searchRef.current.focus();
  }, [search]);

  // persist showAdvanced state when it changes
  React.useEffect(() => {
    if (showAdvanced !== undefined)
      localStorage.setItem('advanced', JSON.stringify(showAdvanced));
  }, [showAdvanced]);

  React.useEffect(() => {
    const stored = localStorage.getItem('advanced');
    if (stored) setShowAdvanced(JSON.parse(stored));
  }, []);

  const setProp = (propName, value) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    let props;
    if (type.properties[propName] !== undefined) props = component.props;
    else if (
      type.designProperties &&
      type.designProperties[propName] !== undefined
    ) {
      if (!component.designProps) component.designProps = {};
      props = component.designProps;
    } else {
      console.error('unexpected prop', propName);
      props = component.props;
    }
    if (value !== undefined) props[propName] = value;
    else delete props[propName];
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
    if (!component.text) component.text = undefined;
    setDesign(nextDesign);

    ReactGA.event({
      category: 'edit',
      action: 'reset component',
    });
  };

  const newDesignFrom = () => {
    const [nextDesign, nextSelected] = newFrom(design, selected);
    setDesign(nextDesign);
    setSelected(nextSelected);

    ReactGA.event({ category: 'switch', action: 'new design from' });
  };

  const duplicate = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const newId = duplicateComponent(nextDesign, selected.component);
    setDesign(nextDesign);
    setSelected({ ...selected, component: newId });

    ReactGA.event({
      category: 'edit',
      action: 'duplicate component',
    });
  };

  const delet = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const parentId = deleteComponent(nextDesign, selected.component);
    setSelected({ ...selected, component: parentId });
    setDesign(nextDesign);

    ReactGA.event({
      category: 'edit',
      action: 'delete component',
    });
  };

  const onKey = event => {
    if (document.activeElement === document.body) {
      if (
        (event.key === 'Backspace' && event.metaKey) || // osx
        ((event.key === 'Backspace' || event.key === 'Delete') && event.ctrlKey)
      ) {
        // windows
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

  const parent = getParent(design, component.id);
  const parentType = parent && getComponentType(libraries, parent.type);
  let firstRef = false;

  const renderProperties = (id, properties, props) =>
    Object.keys(properties)
      .filter(propName => !searchExp || searchExp.test(propName))
      .filter(
        propName =>
          typeof properties[propName] !== 'string' ||
          !properties[propName].startsWith('-component-'),
      )
      .filter(
        propName =>
          !type.advancedProperties ||
          showAdvanced ||
          type.advancedProperties.indexOf(propName) === -1,
      )
      .map((propName, index) => (
        <Fragment key={`${id}-${propName}`}>
          <Property
            ref={searchExp && !firstRef ? defaultRef : undefined}
            first={index === 0}
            design={design}
            theme={theme}
            linkOptions={linkOptions}
            componentId={component.id}
            name={propName}
            property={properties[propName]}
            props={props}
            selected={selected}
            setSelected={setSelected}
            value={props ? props[propName] : undefined}
            onChange={value => setProp(propName, value)}
          />
          {(firstRef = true)}
        </Fragment>
      ));

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box height="100vh" border="left">
        <Box flex={false} direction="row" justify="between" border="bottom">
          <Box flex direction="row">
            <Menu
              fill
              hoverIndicator
              justifyContent="between"
              label={
                <Heading level={2} size="18px" margin="none" truncate>
                  {type.name}
                </Heading>
              }
              dropProps={{ align: { top: 'bottom' } }}
              items={[
                { label: 'code', onClick: () => setShowCode(true) },
                { label: 'new design from', onClick: newDesignFrom },
                { label: 'reset', onClick: reset },
                { label: 'help', href: type.documentation, target: '_blank' },
              ]}
            />
            {showCode && (
              <ComponentCode
                component={component}
                design={design}
                imports={imports}
                theme={theme}
                onDone={() => setShowCode(false)}
              />
            )}
          </Box>
          {!component.coupled && (
            <Box flex={false} direction="row" align="center">
              <ActionButton
                title="duplicate"
                icon={<Duplicate />}
                onClick={duplicate}
              />
              {references.length === 0 ? (
                <ActionButton title="delete" icon={<Trash />} onClick={delet} />
              ) : (
                <ActionButton
                  ref={referencesRef}
                  title="references"
                  icon={<Location />}
                  onClick={() => setShowReferences(!showReferences)}
                />
              )}
              {showReferences && (
                <Drop
                  target={referencesRef.current}
                  align={{ top: 'bottom', right: 'right' }}
                  onClickOutside={() => setShowReferences(false)}
                  onEsc={() => setShowReferences(false)}
                >
                  <Box>
                    {references.map(r => (
                      <Button
                        hoverIndicator
                        onClick={() => {
                          setSelected({
                            ...selected,
                            screen: getScreenForComponent(design, r.id),
                            component: r.id,
                          });
                        }}
                      >
                        <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                          <Text>{r.id}</Text>
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Drop>
              )}
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
                  <Markdown>{type.help}</Markdown>
                </Box>
              )}
              {(!searchExp || searchExp.test('name')) && (
                <TextInputField
                  name="name"
                  componentId={component.id}
                  value={component.name || ''}
                  onChange={value => {
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    const component = nextDesign.components[selected.component];
                    component.name = value;
                    // don't let unnamed components stay hidden
                    if (!value) delete component.hide;
                    setDesign(nextDesign);
                  }}
                />
              )}
              {type.text && (!searchExp || searchExp.test('text')) && (
                <TextAreaField
                  name="text"
                  componentId={component.id}
                  value={
                    component.text === undefined
                      ? type.text
                      : component.text || ''
                  }
                  onChange={value => {
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    const component = nextDesign.components[selected.component];
                    component.text = value;
                    setDesign(nextDesign);
                  }}
                />
              )}
              {type.hideable &&
                component.name &&
                (!searchExp || searchExp.test('hide')) && (
                  <Field label="hide" htmlFor="hide">
                    <Box pad="small">
                      <CheckBox
                        ref={searchExp && !firstRef ? defaultRef : undefined}
                        id="hide"
                        name="hide"
                        checked={!!component.hide}
                        onChange={() => setHide(!component.hide)}
                      />
                      {(firstRef = true)}
                    </Box>
                  </Field>
                )}
              {type.designProperties && (
                <Box flex="grow">
                  {renderProperties(
                    component.id,
                    type.designProperties,
                    component.designProps,
                  )}
                </Box>
              )}
            </Box>

            {type.properties && (
              <Box flex="grow">
                {type.structure ? (
                  <Box flex="grow">
                    {type.structure
                      .filter(
                        ({ properties }) =>
                          !searchExp ||
                          properties.some(propName => searchExp.test(propName)),
                      )
                      .map(({ label, properties: propertyNames }) => {
                        const sectionProperties = {};
                        propertyNames.forEach(
                          name =>
                            (sectionProperties[name] = type.properties[name]),
                        );
                        return (
                          <Box
                            key={label}
                            flex={false}
                            margin={{ top: 'small' }}
                          >
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
                            {renderProperties(
                              component.id,
                              sectionProperties,
                              component.props,
                            )}
                            {(firstRef = true)}
                          </Box>
                        );
                      })}
                  </Box>
                ) : (
                  <Box flex="grow">
                    <Heading
                      level={3}
                      size="small"
                      margin={{ horizontal: 'medium', vertical: 'medium' }}
                    >
                      Properties
                    </Heading>
                    {renderProperties(
                      component.id,
                      type.properties,
                      component.props,
                    )}
                    {parentType && parentType.container && (
                      <Box pad="medium">
                        <Paragraph size="small" color="text-xweak">
                          adjust the layout of this {type.name} via its
                          containing{' '}
                          <Anchor
                            label={parentType.name}
                            onClick={() => {
                              setSelected({
                                ...selected,
                                component: parent.id,
                              });
                            }}
                          />
                        </Paragraph>
                      </Box>
                    )}
                  </Box>
                )}

                <Box pad="medium">
                  <CheckBox
                    label="advanced"
                    checked={showAdvanced}
                    toggle
                    onChange={() => setShowAdvanced(!showAdvanced)}
                  />
                </Box>

                {(!searchExp || searchExp.test('style')) && showAdvanced && (
                  <TextAreaField
                    name="style"
                    componentId={component.id}
                    value={
                      component.style
                        ? JSON.stringify(component.style, null, 2)
                        : ''
                    }
                    onChange={value => {
                      try {
                        const json = JSON.parse(value);
                        setProp('style', json);
                      } catch (e) {
                        // console.log('!!! catch');
                      }
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Keyboard>
  );
};
