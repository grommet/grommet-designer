import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Drop,
  Header,
  Heading,
  Keyboard,
  Markdown,
  Menu,
  Paragraph,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'grommet';
import { Duplicate, Location, Multiple, Trash } from 'grommet-icons';
import Property from './Property';
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import ComponentCode from './ComponentCode';
import CopyPropertiesFrom from './CopyPropertiesFrom';
import {
  deleteComponent,
  disconnectReference,
  duplicateComponent,
  getAlternativeOptions,
  getLinkOptions,
  getParent,
  getReferences,
  getScreenForComponent,
  newFrom,
  upgradeDesign,
} from '../design';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';
import { getComponentType } from '../utils';

const responsiveSizePad = {
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
};

const Properties = ({
  component,
  design,
  imports,
  libraries,
  selected,
  theme,
  setDesign,
  setSelected,
}) => {
  const type = useMemo(
    () => getComponentType(libraries, component.type) || {},
    [component, libraries],
  );
  const references = useMemo(() => getReferences(design, component.id), [
    component,
    design,
  ]);
  const [showReferences, setShowReferences] = useState();
  const [showAdvanced, setShowAdvanced] = useState();
  const [responsiveSize, setResponsiveSize] = useState('medium');
  const [search, setSearch] = useState();
  const searchExp = useMemo(() => search && new RegExp(search, 'i'), [search]);
  const linkOptions = useMemo(
    () => getLinkOptions(design, libraries, selected),
    [design, libraries, selected],
  );
  const alternativeOptions = useMemo(
    () => getAlternativeOptions(design, libraries, selected),
    [design, libraries, selected],
  );
  const [showCode, setShowCode] = useState();
  const [copyFrom, setCopyFrom] = useState();
  const [style, setStyle] = useState(
    component.style ? JSON.stringify(component.style, null, 2) : '',
  );

  const searchRef = useRef();
  const defaultRef = useRef();
  const referencesRef = useRef();

  useEffect(() => setSearch(undefined), [component.id]);

  useEffect(() => {
    if (search !== undefined) searchRef.current.focus();
  }, [search]);

  // persist showAdvanced state when it changes
  useEffect(() => {
    if (showAdvanced !== undefined)
      localStorage.setItem('advanced', JSON.stringify(showAdvanced));
  }, [showAdvanced]);

  useEffect(() => {
    const stored = localStorage.getItem('advanced');
    if (stored) setShowAdvanced(JSON.parse(stored));
  }, []);

  const setProp = (propName, value, nextDesignArg) => {
    const nextDesign = nextDesignArg || JSON.parse(JSON.stringify(design));
    let component = nextDesign.components[selected.component];
    if (component.responsive && component.responsive[responsiveSize]) {
      component = component.responsive[responsiveSize];
    }
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
    if (!nextDesignArg) setDesign(nextDesign);
  };

  const setHide = (hide) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.hide = hide;
    setDesign(nextDesign);
  };

  const reset = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[selected.component];
    component.props = {};
    delete component.responsive;
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

  const disconnect = () => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const newId = disconnectReference({
      nextDesign,
      id: selected.component,
      imports,
    });
    if (newId) {
      setDesign(nextDesign);
      setSelected({ ...selected, component: newId });

      ReactGA.event({
        category: 'edit',
        action: 'disconnect reference',
      });
    }
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
    if (!design.components[selected.component].coupled) {
      const nextDesign = JSON.parse(JSON.stringify(design));
      const nextSelected = { ...selected };
      deleteComponent(nextDesign, selected.component, nextSelected);
      upgradeDesign(nextDesign); // clean up links
      setSelected(nextSelected);
      setDesign(nextDesign);

      ReactGA.event({
        category: 'edit',
        action: 'delete component',
      });
    }
  };

  const onKey = (event) => {
    if (document.activeElement === document.body) {
      if (
        // osx
        (event.key === 'Backspace' && event.metaKey) ||
        // windows
        ((event.key === 'Backspace' || event.key === 'Delete') && event.ctrlKey)
      ) {
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
      .filter((propName) => !searchExp || searchExp.test(propName))
      .filter(
        (propName) =>
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
            alternativeOptions={alternativeOptions}
            componentId={component.id}
            name={propName}
            property={properties[propName]}
            props={props}
            responsiveSize={responsiveSize}
            selected={selected}
            setSelected={setSelected}
            value={props ? props[propName] : undefined}
            onChange={(value, nextDesign) =>
              setProp(propName, value, nextDesign)
            }
          />
          {(firstRef = true)}
        </Fragment>
      ));

  const menuItems = [
    { label: 'show code ...', onClick: () => setShowCode(true) },
    { label: 'copy properties from ...', onClick: () => setCopyFrom(true) },
    {
      label: `create new design using this ${type.name}`,
      onClick: newDesignFrom,
    },
    component.type === 'designer.Reference'
      ? { label: 'disconnect Reference', onClick: disconnect }
      : undefined,
    { label: 'reset', onClick: reset },
    {
      label: `help on ${type.name}`,
      href: type.documentation,
      target: '_blank',
    },
  ].filter((i) => i);

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box border="left">
        <Box flex={false} direction="row" justify="between" border="bottom">
          <Box flex direction="row">
            <Menu
              hoverIndicator
              label={
                <Text weight="bold" truncate>
                  {type.name}
                </Text>
              }
              dropProps={{ align: { top: 'bottom', left: 'left' } }}
              items={menuItems}
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
            {copyFrom && (
              <CopyPropertiesFrom
                component={component}
                design={design}
                setDesign={setDesign}
                onDone={() => setCopyFrom(false)}
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
                    {references.map((r) => (
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
              onChange={(event) => setSearch(event.target.value)}
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
                  onChange={(value) => {
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
                  value={component.text || ''}
                  onChange={(value) => {
                    const nextDesign = JSON.parse(JSON.stringify(design));
                    const component = nextDesign.components[selected.component];
                    component.text = value === '' ? undefined : value;
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
                    (
                      (component.responsive &&
                        component.responsive[responsiveSize]) ||
                      component
                    ).designProps,
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
                          properties.some((propName) =>
                            searchExp.test(propName),
                          ),
                      )
                      .map(({ label, properties: propertyNames }) => {
                        const sectionProperties = {};
                        propertyNames.forEach(
                          (name) =>
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
                              (
                                (component.responsive &&
                                  component.responsive[responsiveSize]) ||
                                component
                              ).props,
                            )}
                            {(firstRef = true)}
                          </Box>
                        );
                      })}
                  </Box>
                ) : (
                  <Box flex="grow">
                    <Header>
                      <Heading
                        level={3}
                        size="small"
                        margin={{ horizontal: 'medium', vertical: 'medium' }}
                      >
                        Properties
                      </Heading>
                      {type.respondable && !component.responsive && (
                        <Button
                          title="ResponsiveContext variations"
                          icon={<Multiple />}
                          hoverIndicator
                          onClick={() => {
                            const nextDesign = JSON.parse(
                              JSON.stringify(design),
                            );
                            const component =
                              nextDesign.components[selected.component];
                            component.responsive = {
                              small: { props: {} },
                              large: { props: {} },
                            };
                            setDesign(nextDesign);
                            setResponsiveSize('medium');
                          }}
                        />
                      )}
                    </Header>
                    {component.responsive && (
                      <Box
                        border="top"
                        pad={{ start: 'medium', vertical: 'small' }}
                        gap="small"
                      >
                        <Box margin={{ end: 'medium' }}>
                          <Heading level={4} size="small" margin="none">
                            ResponsiveContext
                          </Heading>
                          <Paragraph margin="none" size="small">
                            Properties set for medium size are used unless
                            over-ridden by a property for small or large size.
                          </Paragraph>
                        </Box>
                        <Box direction="row" align="center" justify="between">
                          <RadioButtonGroup
                            direction="row"
                            options={['small', 'medium', 'large']}
                            value={responsiveSize}
                            onChange={({
                              target: { value: nextResponsiveSize },
                            }) => setResponsiveSize(nextResponsiveSize)}
                          >
                            {(option, { checked }) => (
                              <Box
                                border={{
                                  side: 'all',
                                  size: 'small',
                                  color: checked ? 'selected-text' : 'border',
                                }}
                                pad={{
                                  vertical: 'xsmall',
                                  horizontal: responsiveSizePad[option],
                                }}
                                round="xxsmall"
                              >
                                <Text
                                  size="small"
                                  color={checked ? 'selected-text' : 'border'}
                                  weight={checked ? 'bold' : undefined}
                                >
                                  {option[0].toUpperCase()}
                                </Text>
                              </Box>
                            )}
                          </RadioButtonGroup>
                          <Button
                            icon={<Trash />}
                            hoverIndicator
                            onClick={() => {
                              const nextDesign = JSON.parse(
                                JSON.stringify(design),
                              );
                              const component =
                                nextDesign.components[selected.component];
                              delete component.responsive;
                              setDesign(nextDesign);
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                    {renderProperties(
                      component.id,
                      type.properties,
                      (
                        (component.responsive &&
                          component.responsive[responsiveSize]) ||
                        component
                      ).props,
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
                    value={style}
                    onChange={(value) => {
                      setStyle(value);
                      try {
                        // only save it when it's valid
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

export default Properties;
