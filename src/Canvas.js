import React, { Component } from 'react';
import { types } from './Types';
import Icon from './Icon';
import { defaultComponent, getComponent, getParent } from './designs';

class Canvas extends Component {
  state = {}

  setHide = (id, hide) => {
    const { design, selected: { screen }, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    nextDesign.screens[screen].components[id].hide = hide;
    onChange({ design: nextDesign });
  }

  moveChild = (dragging, dropTarget) => {
    const { design, selected, onChange } = this.props;
    const nextDesign = JSON.parse(JSON.stringify(design));
    // remove from old parent
    const parent = getParent(nextDesign, { ...selected, component: dragging });
    const index = parent.children.indexOf(dragging);
    parent.children.splice(index, 1);
    // add to new parent
    const nextParent = getComponent(nextDesign, { ...selected, component: dropTarget });
    if (!nextParent.children) nextParent.children = [];
    nextParent.children.push(dragging);
    this.setState({ dragging: undefined, dropTarget: undefined });
    onChange({ design: nextDesign });
  }

  followLink = (to) => {
    const { design, onChange } = this.props;
    const target = getComponent(design, to);
    if (target) {
      const layer = target;
      this.setHide(layer.id, !layer.hide);
    } else {
      onChange({
        selected: {
          screen: to.screen,
          component: defaultComponent(design, to.screen),
        },
      });
    }
  }

  renderComponent = (id) => {
    const { design, preview, selected, theme, onChange } = this.props;
    const { dropTarget  } = this.state;
    const screen = design.screens[selected.screen];
    const component = screen.components[id];
    if (!component || component.hide) {
      return null;
    }
    const type = types[component.type];
    const specialProps = {};
    if (type.name === 'Button' && component.props.icon) {
      specialProps.icon = <Icon icon={component.props.icon} />;
    }
    if (type.name === 'Layer') {
      specialProps.onClickOutside = () => this.setHide(id, true);
      specialProps.onEsc = () => this.setHide(id, true);
    }
    if (type.name === 'Menu') {
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
    }
    const droppable = !type.text && type.name !== 'Icon';
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
            this.followLink(component.linkTo);
          } else if (event.target === event.currentTarget) {
            onChange({ selected: { ...selected, component: id } });
          }
        },
        draggable: !preview && component.type !== 'Grommet',
        onDragStart: preview ? undefined : (event) => {
          event.stopPropagation();
          event.dataTransfer.setData('text/plain', 'ignored'); // for Firefox
          this.setState({ dragging: id });
        },
        onDragEnd: preview ? undefined : (event) => {
          event.stopPropagation();
          this.setState({ dragging: undefined, dropTarget: undefined });
        },
        onDragEnter: preview ? undefined : (event) => {
          if (droppable) event.stopPropagation();
          const { dragging } = this.state;
          if (dragging && dragging !== id && droppable) {
            this.setState({ dropTarget: id });
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
          this.moveChild(dragging, dropTarget);
        },
        style: !preview && selected.component === id
          ? { outline: '1px dashed red' }
          : (dropTarget === id ? { outline: '5px dashed blue' } : undefined),
        ...component.props,
        ...specialProps,
        theme: (type.name === 'Grommet' ? theme : undefined),
      },
      component.children
        ? component.children.map(childId => this.renderComponent(childId))
        : component.text || type.text);
  }

  render() {
    const { design, selected } = this.props;
    const rootComponent = defaultComponent(design, selected.screen);
    return this.renderComponent(rootComponent);
  }
}

export default Canvas;
