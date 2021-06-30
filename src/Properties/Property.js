import React from 'react';
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

const Property = React.forwardRef(
  ({ property: propertyArg, value, ...rest }, ref) => {
    let property =
      propertyArg && propertyArg.dynamicProperty
        ? propertyArg.dynamicProperty({ value })
        : propertyArg;

    if (Array.isArray(property)) {
      if (property.includes('-color-')) {
        return <ColorProperty ref={ref} value={value} {...rest} />;
      }
      if (property.includes('-Icon-')) {
        return <IconProperty ref={ref} value={value} {...rest} />;
      }
      if (property.includes('-link-options-')) {
        return (
          <FunctionProperty
            ref={ref}
            value={value}
            property={LinkOptionsProperty}
            {...rest}
          />
        );
      }
      if (property.includes('-link-checked-')) {
        return (
          <FunctionProperty
            ref={ref}
            value={value}
            options={[
              { label: 'checked', value: '-checked-' },
              { label: 'unchecked', value: '-unchecked-' },
              { label: 'both', value: '-both-' },
            ]}
            property={LinkPropertyOptions}
            {...rest}
          />
        );
      }
      if (property.includes('-link-')) {
        return <LinkProperty ref={ref} value={value} {...rest} />;
      }
      if (property.includes('-alternative-')) {
        return <AlternativeProperty ref={ref} value={value} {...rest} />;
      }
      if (property.includes('-reference-')) {
        return <ReferenceProperty ref={ref} value={value} {...rest} />;
      }
      if (property.includes('-theme-')) {
        // get options from theme, special casing
        const { design, selected, theme } = rest;
        const component = design.components[selected.component];
        if (component.type === 'grommet.Button' && theme.button.toolbar)
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
      if (
        property.some((p) => typeof p === 'string' && p.includes('-property-'))
      ) {
        const [, from] = property[0].split(' ');
        return (
          <OptionsProperty
            ref={ref}
            multiple
            value={value}
            options={rest.props[from]}
            {...rest}
          />
        );
      }
      return (
        <ArrayProperty ref={ref} options={property} value={value} {...rest} />
      );
    } else if (typeof property === 'string') {
      if (property.includes('-property-')) {
        const [, from] = property.split(' ');
        return (
          <OptionsProperty
            ref={ref}
            value={value}
            options={rest.props[from]}
            {...rest}
          />
        );
      }
      if (property.includes('-component-')) {
        return <ComponentProperty ref={ref} value={value} {...rest} />;
      }
      return <StringProperty ref={ref} value={value} {...rest} />;
    } else if (typeof property === 'number') {
      return <NumberProperty ref={ref} value={value} {...rest} />;
    } else if (typeof property === 'boolean') {
      return <BooleanProperty ref={ref} value={value} {...rest} />;
    } else if (typeof property === 'object') {
      return (
        <ObjectProperty
          ref={ref}
          value={value}
          property={property}
          Property={Property}
          {...rest}
        />
      );
    } else if (typeof property === 'function') {
      return (
        <FunctionProperty
          ref={ref}
          value={value}
          property={property}
          {...rest}
        />
      );
    }
    return null;
  },
);

export default Property;
