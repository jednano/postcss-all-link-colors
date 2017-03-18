# postcss-all-link-colors

<img align="right" width="135" height="95"
	title="Philosopher’s stone, logo of PostCSS"
	src="http://postcss.github.io/postcss/logo-leftp.png">

[![NPM version](http://img.shields.io/npm/v/postcss-all-link-colors.svg?style=flat)](https://www.npmjs.org/package/postcss-all-link-colors)
[![npm license](http://img.shields.io/npm/l/postcss-all-link-colors.svg?style=flat-square)](https://www.npmjs.org/package/postcss-all-link-colors)
[![Travis Build Status](https://img.shields.io/travis/jedmao/postcss-all-link-colors.svg)](https://travis-ci.org/jedmao/postcss-all-link-colors)
[![codecov](https://codecov.io/gh/jedmao/postcss-all-link-colors/branch/master/graph/badge.svg)](https://codecov.io/gh/jedmao/postcss-all-link-colors)
[![Dependency Status](https://gemnasium.com/badges/github.com/jedmao/postcss-all-link-colors.svg)](https://gemnasium.com/github.com/jedmao/postcss-all-link-colors)

[![npm](https://nodei.co/npm/postcss-all-link-colors.svg?downloads=true)](https://nodei.co/npm/postcss-all-link-colors/)

[PostCSS](https://github.com/postcss/postcss) plugin to insert colors for link-related pseudo-classes.

## Introduction

Adding [link-related](https://developer.mozilla.org/en-US/docs/Web/CSS/%3Ahover) [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can be a total pain. Just look at how much garbage we have to write!

```css
a {
	color: red;
}
a:visited {
	color: red;
}
a:focus {
	color: red;
}
a:hover {
	color: red;
}
a:active {
	color: red;
}
```

This plugin allows you to simplify the above syntax into the following:

```css
a {
	@link-colors all red;
}
```

You can override individual pseudo-classs like so:

```css
a {
	@link-colors all red {
		focus: white;
		hover: blue;
	}
}
```

This transpiles into:

```css
a {
	color: red;
}
a:visited {
	color: red;
}
a:focus {
	color: white;
}
a:hover {
	color: blue;
}
a:active {
	color: red;
}
```

Of course, you don't have to color _all_ link-related pseudo-classes if you don't want. Just get rid of the `all` parameter to make the colors inclusive:

```css
a {
	@link-colors red {
		hover: white;
	}
}
```

This transpiles into:

```css
a {
	color: red;
}
a:hover {
	color: white;
}
```

Link-related pseudo-classes are written in _LVHA-order:_ `:link` — `:visited` — `:hover` — `:active` with the following variations:
- The `:link` pseudo-class is replaced by just `color`, as it covers not only links, but buttons and other elements as well.
- The `:focus` pseudo-class is placed before or after `:hover`, depending on the order in which you specify it; thus, the desired effect.

## Installation

```
$ npm install postcss-all-link-colors
```

## Usage

### JavaScript

```js
postcss([ require('postcss-all-link-colors') ]);
```

### TypeScript

```ts
import * as postcssAllLinkColors from 'postcss-all-link-colors';

postcss([ postcssAllLinkColors ]);
```

## Options

None at this time.

## Testing

Run the following command:

```
$ npm test
```

This will build scripts, run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.

### Watching

For much faster development cycles, run the following command:

```
$ npm run watch
```

This will build scripts, run tests and watch for changes.

## Similar projects

- [`postcss-link-colors`](https://github.com/steffenmllr/postcss-link-colors)
