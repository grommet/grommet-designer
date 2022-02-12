import { setupDesign } from './reset';
import { upgradeDesign } from './upgrade';
import { copyComponent } from './change';

const empty = {
  screens: { 1: { id: 1, name: 'Screen', path: '/' } },
  screenOrder: [1],
  components: {},
};

export const newFrom = ({
  design,
  externalReferences,
  imports,
  libraries,
  selected,
}) => {
  const nextDesign = setupDesign(empty);
  upgradeDesign(nextDesign);
  const screen = design.screens[selected.screen];
  const id = copyComponent({
    externalReferences,
    nextDesign,
    templateDesign: design,
    id: selected.component || screen.root,
    imports,
    libraries,
    screen: selected.screen,
  });
  nextDesign.name =
    nextDesign.components[id].name || screen.name || nextDesign.name;
  nextDesign.screens[1].name = screen.name;
  nextDesign.screens[1].root = id;
  nextDesign.theme = design.theme;
  return [nextDesign, { component: id, screen: 1 }];
};
