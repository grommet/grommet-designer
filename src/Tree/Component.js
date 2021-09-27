import React, { useContext } from 'react';
import { Box, Button, Stack, Text } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import DesignContext from '../DesignContext';
import { canParent } from '../design';
import { displayName, getReferenceDesign } from '../utils';
import TreeContext from './TreeContext';
import ComponentDropArea from './ComponentDropArea';
import DragDropContext from './DragDropContext';

const treeSubName = (component) =>
  !component.name &&
  !component.text &&
  !component.props.name &&
  !component.props.label &&
  !component.props.icon
    ? undefined
    : component.type.split('.')[1] || component.type;

const Component = ({ screen, id, firstChild }) => {
  const { design, imports, libraries, selected, setSelected, updateDesign } =
    useContext(DesignContext);

  const { selectedAncestors, selectedRef } = useContext(TreeContext);

  const {
    dragging,
    dropTarget,
    dropWhere,
    moveComponent,
    setDragging,
    setDropTarget,
    setDropWhere,
  } = useContext(DragDropContext);

  const component = design.components[id];
  if (!component) return null;
  let reference;
  if (component.type === 'designer.Reference') {
    const referenceDesign = getReferenceDesign(imports, component);
    reference = (referenceDesign || design).components[
      component.props.component
    ];
  }
  const collapserColor = selectedAncestors.includes(id)
    ? 'selected-background'
    : 'border';

  const toggleCollapse = (id) => {
    const nextDesign = JSON.parse(JSON.stringify(design));
    const component = nextDesign.components[id];
    component.collapsed = !component.collapsed;
    updateDesign(nextDesign);
    setSelected({ ...selected, component: id });
  };

  return (
    <Box>
      {firstChild && <ComponentDropArea id={id} where="before" />}
      <Stack anchor="left">
        <Button
          fill
          hoverIndicator
          onClick={() => setSelected({ ...selected, screen, component: id })}
          draggable={!component.coupled}
          onDragStart={(event) => {
            event.dataTransfer.setData('text/plain', ''); // for Firefox
            setDragging(id);
          }}
          onDragEnd={() => {
            setDragging(undefined);
            setDropTarget(undefined);
          }}
          onDragEnter={() => {
            if (
              dragging &&
              dragging !== id &&
              canParent(design, libraries, component)
            ) {
              setDropTarget(id);
              setDropWhere('in');
            }
          }}
          onDragOver={(event) => {
            if (dragging && dragging !== id) {
              event.preventDefault();
            }
          }}
          onDrop={moveComponent}
        >
          <Box
            ref={selected.component === id ? selectedRef : undefined}
            direction="row"
            align="center"
            gap="medium"
            pad={{ vertical: 'xsmall', left: 'large', right: 'small' }}
            background={
              dropTarget && dropTarget === id && dropWhere === 'in'
                ? 'focus'
                : selected.component === id
                ? 'selected-background'
                : undefined
            }
          >
            <Text size="medium" truncate>
              {displayName(
                component?.name ? component : reference || component,
              )}
            </Text>
            <Text size="small" truncate>
              {reference ? 'Reference' : treeSubName(component)}
            </Text>
          </Box>
        </Button>
        {component.children && (
          <Button
            icon={
              component.collapsed ? (
                <FormNext color={collapserColor} />
              ) : (
                <FormDown color={collapserColor} />
              )
            }
            onClick={() => toggleCollapse(id)}
          />
        )}
      </Stack>
      {!component.collapsed && component.children && (
        <Box pad={{ left: 'small' }}>
          {component.children.map((childId, index) => (
            <Component
              key={childId}
              screen={screen}
              id={childId}
              firstChild={index === 0}
            />
          ))}
        </Box>
      )}
      <ComponentDropArea id={id} where="after" />
    </Box>
  );
};

export default Component;
