import React, { Component, Fragment } from 'react';
import { types } from './Types';
import Icon from './Icon';
import { getParent } from './designs';

const arrayExp = /(.+)\[(\d+)\]/;
// converts something like 'data[0].details' to: ['data', 0, 'details']
const parsePath = (text) =>
  text.split('.').map((part) => {
    const match = part.match(arrayExp);
    if (match) {
      return [match[1], parseInt(match[2], 10)];
    }
    return part;
  }).flat();

const find = (data, path) => {
  const pathParts = (typeof path === 'string') ? parsePath(path) : path;
  let value;
  if (typeof data === 'object') {
    value = data[pathParts[0]];
  } else if (Array.isArray(data) && typeof pathParts[0] === 'number') {
    value = data[pathParts[0]];
  }

  if (value && pathParts.length > 1) {
    if (Array.isArray(value) || typeof value === 'object') {
      return find(value, pathParts.slice(1));
    }
  }
  return value;
};

const replace = (text, data, contextPath) =>
  (text || '').replace(/\{[^}]*\}/g, (match) => {
    const dataPath = parsePath(match.slice(1, match.length - 1));
    return find(data, contextPath ? [...contextPath, ...dataPath] : dataPath) || match;
  });

class Canvas extends Component {
  state = {}

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  load() {
    const { design } = this.props;
    const { data } = this.state;
    if (!data && design.data) {
      const firstData = {};
      this.setState({ data: firstData });
      Object.keys(design.data).forEach((key) => {
        if (design.data[key].slice(0, 4) === 'http') {
          fetch(design.data[key])
          .then(response => response.json())
          .then((response) => {
            const { data } = this.state;
            const nextData = { ...data };
            nextData[key] = response;
            this.setState({ data: nextData });
          });
        } else if (design.data[key]) {
          firstData[key] = JSON.parse(design.data[key]);
        }
      });
      this.setState({ data: firstData });
    }
  }

  setHide = (id, hide) => {
    const { design, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.components[id].hide = hide;
    onChange({ design: nextDesign });
  }

  moveChild = (dragging, dropTarget) => {
    const { design, onChange } = this.props;
    const { dropAt } = this.state;
    const nextDesign = JSON.parse(JSON.stringify(design));

    const parent = getParent(nextDesign, dragging);
    const index = parent.children.indexOf(dragging);

    const nextParent = nextDesign.components[dropTarget];
    if (!nextParent.children) nextParent.children = [];
    const nextIndex = dropAt !== undefined
      ? nextParent.children.indexOf(dropAt) : nextParent.children.length;

    parent.children.splice(index, 1);
    nextParent.children.splice(nextIndex, 0, dragging);

    this.setState({ dragging: undefined, dropTarget: undefined, dropAt: undefined });
    onChange({ design: nextDesign });
  }

  followLink = (to) => {
    const { design, onChange } = this.props;
    const target = design.components[to.component];
    if (target && target.type === 'Layer') {
      this.setHide(target.id, !target.hide);
    } else {
      onChange({ selected: to });
    }
  }

  renderRepeater = (component, dataContextPath) => {
    const { data } = this.state;
    const { children, props: { count, dataPath } } = component;
    let contents;
    if (children) {
      if (data && dataPath) {
        const path = dataContextPath
          ? [...dataContextPath, ...parsePath(dataPath)] : parsePath(dataPath);
        const dataValue = find(data, path);
        if (dataValue && Array.isArray(dataValue)) {
          contents = dataValue.map((item, index) => (
            <Fragment key={index}>
              {component.children.map(childId =>
                this.renderComponent(childId, [...path, index]))}
            </Fragment>
          ));
        }
      }
      if (!contents) {
        contents = [];
        for (let i = 0; i < (count || 1); i += 1) {
          contents.push(component.children.map(childId =>
            this.renderComponent(childId, dataContextPath)));
        }
      }
    }
    return (
      <Fragment>
        {contents}
      </Fragment>
    );
  }

  renderComponent = (id, dataContextPath) => {
    const { design, preview, selected, theme, onChange } = this.props;
    const { data, dropTarget, dropAt  } = this.state;
    const designComponent = design.components[id];
    const reference = (designComponent && designComponent.type === 'Reference'
      && design.components[designComponent.props.component]);
    const component = reference || designComponent;
    const type = types[component.type];
    const contextPath = dataContextPath || selected.dataContextPath;

    if (!component || component.hide) {
      return null;
    }

    if (type.name === 'Repeater') {
      return this.renderRepeater(component, contextPath);
    }

    // set up any properties that need special handling
    const specialProps = {};
    if (type.name === 'Button' && component.props.icon) {
      specialProps.icon = <Icon icon={component.props.icon} />;
    } else if (type.name === 'Layer') {
      specialProps.onClickOutside = () => this.setHide(id, true);
      specialProps.onEsc = () => this.setHide(id, true);
    } else if (type.name === 'Menu') {
      specialProps.items = (component.props.items || []).map(item => ({
        ...item,
        onClick: (event) => {
          event.stopPropagation();
          this.followLink(item.linkTo);
        }
      }));
      if (component.props.icon) {
        specialProps.icon = <Icon icon={component.props.icon} />;
      }
    } else if (type.name === 'Image') {
      // get 'src' from data, if needed
      specialProps.src = replace(component.props.src, data, contextPath);
    }

    const droppable = !type.text && type.name !== 'Icon';
    let style;
    if (dropTarget === id) {
      style = { outline: '5px dashed blue' };
    } else if (dropAt === id) {
      style = { outline: '1px dashed blue' };
    } else if (!preview && selected.component === id) {
      style = { outline: '1px dashed red' };
    }

    let children;
    if (component.children) {
      children = component.children.map(childId =>
        this.renderComponent(childId, dataContextPath));
    } else if (component.text) {
      if (data) {
        // resolve any data references
        children = replace(component.text, data, contextPath);
      } else {
        children = component.text;
      }
    } else {
      children = type.text;
    }

    return React.createElement(
      type.component,
      {
        key: id,
        onClick: (event) => {
          if (component.type === 'Menu') {
            event.stopPropagation();
            onChange({ selected: { ...selected, component: id } });
          } else if (component.linkTo) {
            event.stopPropagation();
            this.followLink({ ...component.linkTo, dataContextPath });
          } else if (event.target === event.currentTarget) {
            onChange({ selected: { ...selected, component: id } });
          }
        },
        draggable: !preview && component.type !== 'Grommet',
        onDragStart: preview ? undefined : (event) => {
          event.stopPropagation();
          event.dataTransfer.setData('text/plain', ''); // for Firefox
          this.setState({ dragging: id });
        },
        onDragEnd: preview ? undefined : (event) => {
          event.stopPropagation();
          this.setState({ dragging: undefined, dropTarget: undefined });
        },
        onDragEnter: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging } = this.state;
          if (dragging && dragging !== id) {
            if (droppable) {
              this.setState({ dropTarget: id });
            } else {
              this.setState({ dropAt: id });
            }
          }
        },
        onDragOver: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging } = this.state;
          if (dragging && dragging !== id && droppable) {
            event.preventDefault();
          }
        },
        onDrop: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging, dropTarget } = this.state;
          if (dropTarget) {
            this.moveChild(dragging, dropTarget);
          }
        },
        style,
        ...component.props,
        ...specialProps,
        theme: (type.name === 'Grommet' ? theme : undefined),
      },
      children,
    );
  }

  render() {
    const { design, selected } = this.props;
    const rootComponent = design.screens[selected.screen].root;
    return this.renderComponent(rootComponent);
  }
}

export default Canvas;
