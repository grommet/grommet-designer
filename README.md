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

### Design Components

The following components are not part of grommet. They are components
specific to this tool that come in rather handy for what this tool does.

#### Repeater

Give this component a `count` and it will repeat it's children count times.
This is super useful when mocking up lists and tiles.

#### Reference

Allows re-using another component in the design. For instance, if every
screen has the same banner at the top, create it in the first screen and
then reference it in subsequent screens. Hint: This is easier to use if you
give the component you want to re-use a `name`.

### Images

You can create SVG images in another tool and then embed them inline in the
design as either the `src` for an Image or the `background.image` for a Box.

### Theming

You can perform basic theme customization, colors and fonts, in the
design configuration (wrench). Any font family in quotes will be searched
for in google's font site and the appropriate face definition will
automatically be added to the theme.

## Local development

1. `git clone`

1. `yarn install`

1. `yarn start`
