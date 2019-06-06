# grommet-designer

A tool to design screens using grommet components.

Live at: [designer.grommet.io](https://designer.grommet.io)

## Reference

### Command shortcuts

* **command-e**: toggles preview vs. edit modes
* **commend-delete**: deletes the currently selected component and all of its children

### Linking

Button and Menu items provide a means of linking them to affect the behavior
of other components. They can either navigate to another screen or toggle
whether a Layer is visible.

Layers can be toggled manually via the `hide` control on the right
when selecting a Layer.

### Saving

Your latest design edits are saved in your browser's local storage. So,
you can refresh your window without fear of losing anything.

You can save separate designs locally via the Folder control in the lower left.
Give them a name and click the Save control to keep it separate. This allows you
to park that design and switch to another one or start a new one.

### Sharing

The Share control in the lower left provides three methods of sharing.

1. Publish your design. This will generate a unique URL you can send
to someone. When they open that URL, they will see your work. They will not be
able to modify it.
1. Download the design as a JSON file. You can save or send this
however you like. You can upload one of these files using the Folder control
dialog, via the Upload control at the bottom.
1. Generate the appropriate code for your design such that you
or a developer could run it as an actual site.

## Local development

1. `git clone`

1. `yarn install`

1. `yarn start`
