# stencil-sass


This package is used to easily precompile Sass files within Stencil components. Internally this plugin uses [sass](https://www.npmjs.com/package/sass).

This package is a fork of [@stencil/sass](https://github.com/ionic-team/stencil-sass) to work around problems with the bundled [sass](https://www.npmjs.com/package/sass) implementation

First, npm install within the project:

```
npm install stencil-sass sass --save-dev
```

Or with yarn:
```
yarn add stencil-sass sass --dev
```

Next, within the project's stencil config, import the plugin and add it to the config's `plugins` property:

#### stencil.config.ts
```ts
import { Config } from '@stencil/core';
import { sass } from 'stencil-sass';

export const config: Config = {
  plugins: [
    sass()
  ]
};
```

During development, this plugin will kick-in for `.scss` or `.sass` style urls, and precompile them to CSS.


## Options

Sass options can be passed to the plugin within the stencil config, which are used directly by `sass`. Please reference [sass documentation](https://www.npmjs.com/package/sass) for all available options. Note that this plugin automatically adds the component's directory to the `includePaths` array.


### Inject Globals Sass Paths

The `injectGlobalPaths` config is an array of paths that automatically get added as `@import` declarations to all components. This can be useful to inject Sass variables, mixins and functions to override defaults of external collections. For example, apps can override default Sass variables of [Ionic components](https://www.npmjs.com/package/@ionic/core). Relative paths within `injectGlobalPaths` should be relative to the stencil config file.

```js
exports.config = {
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/globals/variables.scss',
        'src/globals/mixins.scss'
      ]
    })
  ]
};
```

Note that each of these files are always added to each component, so in most cases they shouldn't contain CSS because it'll get duplicated in each component. Instead, `injectGlobalPaths` should only be used for Sass variables, mixins and functions, but does not contain any CSS.


## Related

* [sass](https://www.npmjs.com/package/sass)
* [Stencil](https://stenciljs.com/)
* [@stencil/sass](https://www.npmjs.com/package/@stencil/sass)
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com)
* [Ionic Components](https://www.npmjs.com/package/@ionic/core)
* [Ionicons](http://ionicons.com/)

## Credits

The heavy lifting was done by the [ionic-team](https://github.com/ionic-team) i just changed the imports to sass.
So all credits belongs to the ionic-team.
