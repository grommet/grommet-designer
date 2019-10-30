import React, { Fragment } from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  CheckBox,
  Heading,
  Keyboard,
  Paragraph,
  TextArea,
  TextInput,
} from 'grommet';
import { Duplicate, Refresh, Trash } from 'grommet-icons';
import Property from './Property';
import { deleteComponent, duplicateComponent, getLinkOptions } from '../design';
import ActionButton from '../components/ActionButton';
import Field from '../components/Field';
import { getComponentType } from '../utils';

const parseStyle = style => (style ? JSON.stringify(style, null, 2) : '');

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
  const type = React.useMemo(
    () => getComponentType(libraries, component.type) || {},
    [component, libraries],
  );
  const [search, setSearch] = React.useState();
  const searchExp = React.useMemo(
    () => search && new RegExp(`^${search}`, 'i'),
    [search],
  );
  const [style, setStyle] = React.useState(parseStyle(component.props.style));
  const linkOptions = React.useMemo(
    () => getLinkOptions(design, libraries, selected),
    [design, libraries, selected],
  );

  const searchRef = React.useRef();
  const defaultRef = React.useRef();

  React.useEffect(() => setSearch(undefined), [component.id]);
  React.useEffect(() => setStyle(parseStyle(component.props.style)), [
    component.props.style,
  ]);

  React.useEffect(() => {
    if (search !== undefined) searchRef.current.focus();
  }, [search]);

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

    ReactGA.event({
      category: 'edit',
      action: 'reset component',
    });
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
        (event.key === 'Delete' && event.ctrlKey)
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

  let firstRef = false;

  const renderProperties = (properties, props) =>
    Object.keys(properties)
      .filter(propName => !searchExp || searchExp.test(propName))
      .filter(
        propName =>
          typeof properties[propName] !== 'string' ||
          !properties[propName].startsWith('-component-'),
      )
      .map((propName, index) => (
        <Fragment key={propName}>
          <Property
            ref={searchExp && !firstRef ? defaultRef : undefined}
            first={index === 0}
            design={design}
            theme={theme}
            selected={selected}
            linkOptions={linkOptions}
            name={propName}
            property={properties[propName]}
            value={props ? props[propName] : undefined}
            onChange={value => setProp(propName, value)}
          />
          {(firstRef = true)}
        </Fragment>
      ));

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
              {(!searchExp || searchExp.test('name')) && (
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
              {type.hideable && (!searchExp || searchExp.test('hide')) && (
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
              {type.designProperties && (
                <Box flex="grow">
                  {renderProperties(
                    type.designProperties,
                    component.designProps,
                  )}
                </Box>
              )}
            </Box>

            {type.properties && (
              <Box flex="grow">
                {type.structure ? (
                  type.structure
                    .filter(
                      ({ properties }) =>
                        !searchExp ||
                        Object.keys(properties).some(propName =>
                          searchExp.test(propName),
                        ),
                    )
                    .map(({ label, properties: propertyNames }) => {
                      const sectionProperties = {};
                      propertyNames.forEach(
                        name =>
                          (sectionProperties[name] = type.properties[name]),
                      );
                      return (
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
                          {renderProperties(sectionProperties, component.props)}
                          {(firstRef = true)}
                        </Box>
                      );
                    })
                ) : (
                  <Box>
                    <Heading
                      level={3}
                      size="small"
                      margin={{ horizontal: 'medium', vertical: 'medium' }}
                    >
                      Properties
                    </Heading>
                    {renderProperties(type.properties, component.props)}
                  </Box>
                )}

                {(!searchExp || searchExp.test('style')) && (
                  <Field label="style" first margin={{ top: 'large' }}>
                    <TextArea
                      ref={searchExp && !firstRef ? defaultRef : undefined}
                      name="style"
                      rows={2}
                      plain
                      value={style}
                      onChange={event => {
                        setStyle(event.target.value);
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
