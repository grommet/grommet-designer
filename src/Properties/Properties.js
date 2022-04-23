import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import SelectionContext from '../SelectionContext';
import {
  getComponent,
  getParent,
  getType,
  removeComponent,
  setProperty,
  useComponent,
} from '../design2';
import Property from './Property';
import TextInputField from './TextInputField';
import TextAreaField from './TextAreaField';
import ComponentCode from './ComponentCode';
import CopyPropertiesFrom from './CopyPropertiesFrom';
import Field from '../components/Field';
import { getComponentType } from '../utils';

const responsiveSizePad = {
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
};

const Properties = () => {
  const [selection, setSelection] = useContext(SelectionContext);
  const component = useComponent(selection);

  const type = component ? getType(component.type) : undefined;

  const hideable = useMemo(() => {
    // // for Reference component, hideable is driven by where the reference points
    // if (type.name === 'Reference') {
    //   const referencedComponent = design.components[component.props.component];
    //   if (referencedComponent) {
    //     const referencedType = getComponentType(
    //       libraries,
    //       referencedComponent.type,
    //     );
    //     return referencedType?.hideable;
    //   }
    // }
    return type?.hideable;
  }, [/* component, design, libraries, */ type]);
  // const references = useMemo(
  //   () => getReferences(design, component.id),
  //   [component, design],
  // );
  // const [showReferences, setShowReferences] = useState();
  const [showAdvanced, setShowAdvanced] = useState();
  const [responsiveSize, setResponsiveSize] = useState('medium');
  const [showCode, setShowCode] = useState();
  const [copyFrom, setCopyFrom] = useState();
  const [style, setStyle] = useState(
    component?.style ? JSON.stringify(component.style, null, 2) : '',
  );

  // const referencesRef = useRef();

  // persist showAdvanced state when it changes
  useEffect(() => {
    if (showAdvanced !== undefined)
      localStorage.setItem('advanced', JSON.stringify(showAdvanced));
  }, [showAdvanced]);

  useEffect(() => {
    const stored = localStorage.getItem('advanced');
    if (stored) setShowAdvanced(JSON.parse(stored));
  }, []);

  if (!component) return null;

  const parent = getParent(selection);
  const parentType = parent && getType(getComponent(parent)?.type);

  // const reset = () => {
  //   const nextDesign = JSON.parse(JSON.stringify(design));
  //   const component = nextDesign.components[selected.component];
  //   component.props = {};
  //   delete component.responsive;
  //   if (!component.text) component.text = undefined;
  //   changeDesign(nextDesign);

  //   ReactGA.event({
  //     category: 'edit',
  //     action: 'reset component',
  //   });
  // };

  // const newDesignFrom = () => {
  //   const [nextDesign, nextSelected] = newFrom({ design, imports, selected });
  //   changeDesign(nextDesign);
  //   setSelected(nextSelected);

  //   ReactGA.event({ category: 'switch', action: 'new design from' });
  // };

  // const disconnect = () => {
  //   const nextDesign = JSON.parse(JSON.stringify(design));
  //   const newId = disconnectReference({
  //     nextDesign,
  //     id: selected.component,
  //     imports,
  //     libraries,
  //   });
  //   if (newId) {
  //     changeDesign(nextDesign);
  //     setSelected({ ...selected, component: newId });

  //     ReactGA.event({
  //       category: 'edit',
  //       action: 'disconnect reference',
  //     });
  //   }
  // };

  // const duplicate = () => {
  //   const nextDesign = JSON.parse(JSON.stringify(design));
  //   const newId = duplicateComponent({
  //     nextDesign,
  //     id: selected.component,
  //     libraries,
  //   });
  //   changeDesign(nextDesign);
  //   setSelected({ ...selected, component: newId });

  //   ReactGA.event({
  //     category: 'edit',
  //     action: 'duplicate component',
  //   });
  // };

  const delet = () => {
    if (!component.coupled) {
      console.log('!!! delete', selection, parent);
      removeComponent(selection);
      setSelection(parent);

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
      // if (event.key === 'd') {
      //   event.preventDefault();
      //   duplicate();
      // }
    }
  };

  const renderProperties = (definitions, values) =>
    Object.keys(definitions)
      .filter(
        (propName) =>
          !type.advancedProperties ||
          showAdvanced ||
          type.advancedProperties.indexOf(propName) === -1,
      )
      .map((propName) => (
        <Fragment key={propName}>
          <Property
            id={selection}
            name={propName}
            definition={definitions[propName]}
            values={values}
            responsiveSize={responsiveSize}
            value={values?.[propName]}
            onChange={(value) => setProperty(selection, propName, value)}
          />
        </Fragment>
      ));

  const menuItems = [
    { label: 'show code ...', onClick: () => setShowCode(true) },
    { label: 'copy properties from ...', onClick: () => setCopyFrom(true) },
    // {
    //   label: `create new design using this ${type.name}`,
    //   onClick: newDesignFrom,
    // },
    // component.type === 'designer.Reference'
    //   ? { label: 'disconnect Reference', onClick: disconnect }
    //   : undefined,
    // { label: 'reset', onClick: reset },
    {
      label: `help on ${type.name}`,
      href: type.documentation,
      target: '_blank',
    },
  ].filter((i) => i);

  return (
    <Keyboard target="document" onKeyDown={onKey}>
      <Box border="left" height="100vh" overflow="auto">
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
                onDone={() => setShowCode(false)}
              />
            )}
            {copyFrom && (
              <CopyPropertiesFrom
                component={component}
                onDone={() => setCopyFrom(false)}
              />
            )}
          </Box>
          {!component.coupled && (
            <Box flex={false} direction="row" align="center">
              {/* <Button
                title="duplicate"
                tip="duplicate"
                icon={<Duplicate />}
                onClick={duplicate}
              /> */}
              {/* {references.length === 0 ? ( */}
              <Button
                title="delete"
                tip="delete"
                icon={<Trash />}
                onClick={delet}
              />
              {/* }
              // ) : (
              //   <Button
              //     ref={referencesRef}
              //     title="references"
              //     tip="references"
              //     icon={<Location />}
              //     onClick={() => setShowReferences(!showReferences)}
              //   />
              // )}
              {/* {showReferences && (
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
              )} */}
            </Box>
          )}
        </Box>

        <Box flex overflow="auto">
          <Box flex="grow">
            <Box>
              {type.help && (
                <Box pad={{ horizontal: 'medium' }} border="bottom">
                  <Markdown>{type.help}</Markdown>
                </Box>
              )}
              <TextInputField
                name="name"
                componentId={component.id}
                value={component.name || ''}
                onChange={(value) => setProperty(selection, 'name', value)}
              />
              {type.text && (
                <TextAreaField
                  name="text"
                  componentId={component.id}
                  value={component.text || ''}
                  onChange={(value) => setProperty(selection, 'text', value)}
                />
              )}
              {hideable && component.name && (
                <Field label="hide" htmlFor="hide">
                  <Box pad="small">
                    <CheckBox
                      id="hide"
                      name="hide"
                      checked={!!component.hide}
                      onChange={() =>
                        setProperty(selection, 'hide', !component.hide)
                      }
                    />
                  </Box>
                </Field>
              )}
              {type.designProperties && (
                <Box flex="grow" border="top">
                  {renderProperties(
                    type.designProperties,
                    (
                      (component.responsive &&
                        component.responsive[responsiveSize]) ||
                      component
                    ).designProps,
                  )}
                </Box>
              )}
              {/* {type.actions &&
                type.actions(component, {
                  addChildComponent,
                  changeDesign,
                  data,
                  design,
                })} */}
            </Box>

            <Box flex={false} border={type.structure ? 'bottom' : undefined}>
              <Header>
                <Heading
                  level={3}
                  size="small"
                  margin={{ horizontal: 'medium', vertical: 'medium' }}
                >
                  Properties
                </Heading>
                {/* {type.respondable && !component.responsive && (
                  <Button
                    title="ResponsiveContext variations"
                    tip="responsive context variations"
                    icon={<Multiple />}
                    hoverIndicator
                    onClick={() => {
                      const nextDesign = JSON.parse(JSON.stringify(design));
                      const component =
                        nextDesign.components[selected.component];
                      component.responsive = {
                        small: { props: {} },
                        large: { props: {} },
                        hide: [],
                      };
                      changeDesign(nextDesign);
                      setResponsiveSize('medium');
                    }}
                  />
                )} */}
              </Header>
              {/* {component.responsive && (
                <>
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
                        name=""
                        direction="row"
                        options={['small', 'medium', 'large']}
                        value={responsiveSize}
                        onChange={({ target: { value: nextResponsiveSize } }) =>
                          setResponsiveSize(nextResponsiveSize)
                        }
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
                          const nextDesign = JSON.parse(JSON.stringify(design));
                          const component =
                            nextDesign.components[selected.component];
                          delete component.responsive;
                          changeDesign(nextDesign);
                        }}
                      />
                    </Box>
                  </Box>
                  <Field
                    label={`hide when ${responsiveSize}`}
                    htmlFor="responsiveHide"
                    first
                  >
                    <CheckBox
                      id="responsiveHide"
                      name="responsiveHide"
                      checked={component.responsive.hide.includes(
                        responsiveSize,
                      )}
                      onChange={({ target: { checked } }) => {
                        const nextDesign = JSON.parse(JSON.stringify(design));
                        const component =
                          nextDesign.components[selected.component];
                        if (checked)
                          component.responsive.hide.push(responsiveSize);
                        else
                          component.responsive.hide =
                            component.responsive.hide.filter(
                              (s) => s !== responsiveSize,
                            );
                        changeDesign(nextDesign);
                      }}
                    />
                  </Field>
                </>
              )} */}
            </Box>

            {type.properties && (
              <Box flex="grow">
                {type.structure ? (
                  <Box flex="grow">
                    {type.structure.map(
                      ({ label, properties: propertyNames }) => {
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
                              sectionProperties,
                              (
                                (component.responsive &&
                                  component.responsive[responsiveSize]) ||
                                component
                              ).props,
                            )}
                          </Box>
                        );
                      },
                    )}
                  </Box>
                ) : (
                  <Box flex="grow" border="top">
                    {renderProperties(
                      type.properties,
                      (
                        (component.responsive &&
                          component.responsive[responsiveSize]) ||
                        component
                      ).props,
                    )}
                    {parentType?.container && (
                      <Box pad="medium">
                        <Paragraph size="small" color="text-xweak">
                          adjust the layout of this {type.name} via its
                          containing{' '}
                          <Anchor
                            label={parentType.name}
                            onClick={() => setSelection(parent)}
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

                {showAdvanced && (
                  <TextAreaField
                    name="style"
                    componentId={component.id}
                    value={style}
                    onChange={(value) => {
                      setStyle(value);
                      try {
                        // only save it when it's valid
                        const json = JSON.parse(value);
                        setProperty(selection, 'style', json);
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
