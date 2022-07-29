# grommet-designer

A tool to design screens using grommet components.

Live at: [designer.grommet.io](https://designer.grommet.io)

## Reference

### Command shortcuts

- **command-e** or **control-E** or **command-.**: toggles preview vs. edit mode
- **command-;** or **control-;**: toggles preview vs. comment mode
- **a**: opens the add component dialog
- **z**: undo the most recent change
- **Z**: redo the most recently undone change
- **command-c** or **control-c**: copies the selected component
- **command-v** or **control-v**: pastes the previously copied component
  into the selected component
- **command-V** or **control-V**: pastes the previously copied component
  after the selected component
- **s**: toggles collapsing all screens in the component tree

### Linking

Button and Menu items provide a means of linking them to affect the behavior
of other components. They can either navigate to another screen or toggle
whether a Layer is visible.

Layers can be toggled manually via the `hide` control on the right
when selecting a Layer.

### Saving

Your latest design edits are saved in your browser's local storage. So,
you can refresh your window without fear of losing anything. But, if you
clear your browser's local storage, you'll lose whatever you've done.

If you change the name of a design, it will create a new design with that name.
The control in the top left let's you browse your designs, create a new one,
or import a design file you've exported.

### Sharing

The Share control near the upper left provides three methods of sharing.

1. Publish your design. This will generate a unique URL you can send
   to someone. When they open that URL, they will see your work. They will not be
   able to modify the published version. Also see "imports" below.
1. Download the design as a JSON file. You can save or send this
   however you like. You can upload one of these files using the Designs
   dialog, via the Import control.
1. Generate the appropriate code for your design such that you
   or a developer could run it as an actual site.

### Comments

After a design is published, comments can be added to it. If someone is
able to access the design, they will be able to comment on it. Comments
are fully shared, anyone can update or delete individual comments. So, play
nice. Comments support Markdown syntax. There is no protection against
multiple users changing a comment at the same time. The last one to change
will win in this scenario.

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

You can use any theme published via theme-designer.grommet.io, just enter
the published URL in the context of editing the design details. If you want
to change a theme you have published that you are using, edit it in the
theme designer, re-publish it, and then refresh any designer.grommet.io
page using it.

### Data

You can add data sources to a design to make the content more consistent
and real. A data source can be JSON text or a URL to a REST endpoint that
returns JSON. Once you have a data source, you can reference values in it
in Heading, Paragraph, and Text `text` properties and Image `src`
by describing the path to the content
you want inside '{}'. For example: `{data-source-name[0].property-name}`.
You can also reference data in Repeater `dataPath`, so that Repeater will
iterate over an array.

### Includes

Design can be "included" in another design. Any
components in the included design that have been explicitly given a name will
be shown in the list of components that can be added. When added, these
will copied into the current design by value. If components used from
the included design are subsequently modified, the modifications can be
carried propogated via "copy properties from ..." in the component top menu
on the right side.

## Local development

1. `git clone`

1. `yarn install`

1. `yarn start`
