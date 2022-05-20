import React from 'react';
import { getComponent, getTheme } from '../design2';
import AlternativeProperty from './AlternativeProperty';
import ArrayProperty from './ArrayProperty';
import BooleanProperty from './BooleanProperty';
import ColorProperty from './ColorProperty';
import ComponentProperty from './ComponentProperty';
import FunctionProperty from './FunctionProperty';
import IconProperty from './IconProperty';
import LinkProperty from './LinkProperty';
import LinkPropertyOptions from './LinkPropertyOptions';
import LinkOptionsProperty from './LinkOptionsProperty';
import NumberProperty from './NumberProperty';
import ObjectProperty from './ObjectProperty';
import OptionsProperty from './OptionsProperty';
import ReferenceProperty from './ReferenceProperty';
import StringProperty from './StringProperty';
import StringOrComponentProperty from './StringOrComponentProperty';

const Property = React.forwardRef(
  ({ definition: definitionProp, value, ...rest }, ref) => {
    const theme = getTheme();
    let definition = definitionProp?.dynamicProperty
      ? definitionProp.dynamicProperty({ value })
      : definitionProp;

    if (Array.isArray(definition)) {
      if (definition.includes('-color-')) {
        return <ColorProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-Icon-')) {
        return <IconProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-link-options-')) {
        return (
          <FunctionProperty
            ref={ref}
            value={value}
            definition={LinkOptionsProperty}
            {...rest}
          />
        );
      }
      if (definition.includes('-link-checked-')) {
        return (
          <FunctionProperty
            ref={ref}
            value={value}
            options={[
              { label: 'checked', value: '-checked-' },
              { label: 'unchecked', value: '-unchecked-' },
              { label: 'both', value: '-both-' },
            ]}
            definition={LinkPropertyOptions}
            {...rest}
          />
        );
      }
      if (definition.includes('-link-')) {
        return <LinkProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-alternative-')) {
        return <AlternativeProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-reference-')) {
        return <ReferenceProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-theme-')) {
        // get options from theme, special casing
        if (rest.name === 'kind' && theme.button.toolbar)
          return (
            <ArrayProperty
              ref={ref}
              options={['toolbar']}
              value={value}
              {...rest}
            />
          );
        return null;
      }
      if (definition.includes('-data-')) {
        return (
          <ArrayProperty
            ref={ref}
            dataPath
            options={definition.filter((o) => o !== '-data-')}
            value={value}
            {...rest}
          />
        );
      }
      if (
        definition.some(
          (p) => typeof p === 'string' && p.includes('-property-'),
        )
      ) {
        const component = getComponent(rest.id);
        const [, from] = definition[0].split(' ');
        return (
          <OptionsProperty
            ref={ref}
            multiple
            value={value}
            options={component.props[from]}
            {...rest}
          />
        );
      }
      return (
        <ArrayProperty ref={ref} options={definition} value={value} {...rest} />
      );
    } else if (typeof definition === 'string') {
      if (definition.includes('-property-')) {
        const component = getComponent(rest.id);
        const [, from] = definition.split(' ');
        return (
          <OptionsProperty
            ref={ref}
            value={value}
            options={component.props[from]}
            {...rest}
          />
        );
      }
      if (definition.includes('-string-or-component-')) {
        return <StringOrComponentProperty ref={ref} value={value} {...rest} />;
      }
      if (definition.includes('-component-')) {
        return <ComponentProperty ref={ref} value={value} {...rest} />;
      }
      return <StringProperty ref={ref} value={value} {...rest} />;
    } else if (typeof definition === 'number') {
      return <NumberProperty ref={ref} value={value} {...rest} />;
    } else if (typeof definition === 'boolean') {
      return <BooleanProperty ref={ref} value={value} {...rest} />;
    } else if (typeof definition === 'object') {
      return (
        <ObjectProperty
          ref={ref}
          value={value}
          definition={definition}
          Property={Property}
          {...rest}
        />
      );
    } else if (typeof definition === 'function') {
      return (
        <FunctionProperty
          ref={ref}
          value={value}
          definition={definition}
          {...rest}
        />
      );
    }
    return null;
  },
);

export default Property;
