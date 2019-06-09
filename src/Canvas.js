import React, { Component } from 'react';
import { types } from './Types';
import Icon from './Icon';
import { getParent } from './designs';

class Canvas extends Component {
  state = {}

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

  renderComponent = (id) => {
    const { design, preview, selected, theme, onChange } = this.props;
    const { dropTarget, dropAt  } = this.state;
    const designComponent = design.components[id];
    const reference = (designComponent && designComponent.type === 'Reference'
      && design.components[designComponent.props.component]);
    const component = reference || designComponent;

    if (!component || component.hide) {
      return null;
    }

    // set up any properties that need special handling
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
    let style;
    if (dropTarget === id) {
      style = { outline: '5px dashed blue' };
    } else if (dropAt === id) {
      style = { outline: '1px dashed blue' };
    } else if (!preview && selected.component === id) {
      style = { outline: '1px dashed red' };
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
      component.children
        ? component.children.map(childId => this.renderComponent(childId))
        : component.text || type.text);
  }

  render() {
    const { design, selected } = this.props;
    const rootComponent = design.screens[selected.screen].root;
    return this.renderComponent(rootComponent);
  }
}

export default Canvas;
