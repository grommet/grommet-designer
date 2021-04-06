import { setupDesign } from './reset';
import { upgradeDesign } from './upgrade';
import { copyComponent } from './change';

const empty = {
  screens: { 1: { id: 1, name: 'Screen', path: '/' } },
  screenOrder: [1],
  components: {},
};

export const newFrom = (design, selected) => {
  const nextDesign = setupDesign(empty);
  upgradeDesign(nextDesign);
  const id = copyComponent({
    nextDesign,
    templateDesign: design,
    id: selected.component || design.screens[selected.screen].root,
    screen: selected.screen,
  });
  nextDesign.name = nextDesign.components[id].name || nextDesign.name;
  nextDesign.screens[1].root = id;
  return [nextDesign, { component: id, screen: 1 }];
};
