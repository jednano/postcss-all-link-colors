# postcss-all-link-colors

<img align="right" width="135" height="95"
	title="Philosopher’s stone, logo of PostCSS"
	src="http://postcss.github.io/postcss/logo-leftp.png">

[![Travis Build Status](https://img.shields.io/travis/jedmao/postcss-all-link-colors.svg?label=unix%20build)](https://travis-ci.org/jedmao/postcss-all-link-colors)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/jedmao/postcss-all-link-colors.svg?label=windows%20build)](https://ci.appveyor.com/project/jedmao/postcss-all-link-colors)
[![npm version](https://badge.fury.io/js/postcss-all-link-colors.svg)](http://badge.fury.io/js/postcss-all-link-colors)
[![npm license](http://img.shields.io/npm/l/postcss-all-link-colors.svg?style=flat-square)](https://www.npmjs.org/package/postcss-all-link-colors)

[![Code Climate](https://codeclimate.com/github/jedmao/postcss-all-link-colors/badges/gpa.svg)](https://codeclimate.com/github/jedmao/postcss-all-link-colors)
[![Test Coverage](https://codeclimate.com/github/jedmao/postcss-all-link-colors/badges/coverage.svg)](https://codeclimate.com/github/jedmao/postcss-all-link-colors)

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
postcss([
	require('postcss-all-link-colors'),
	// more plugins...
])
```

### TypeScript

```ts
///<reference path="node_modules/postcss-font-colors/.d.ts" />
import postcssAllLinkColors = require('postcss-all-link-colors');

postcss([
	postcssAllLinkColors,
	// more plugins...
])
```

## Options

None at this time.
