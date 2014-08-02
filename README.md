# Component CSS (CCSS) [![Build Status](https://travis-ci.org/icodeforlove/component-css.png?branch=master)](https://travis-ci.org/icodeforlove/component-css)

introduces the @component selector to CSS.

**this was originally released as a react specific CSS preprocessor of its own, but it is being transitioned to be a generic concept**

## why?

as we start to develop websites in a modular way with nested components it starts to make sense to have your selectors only effect the component you're targeting, and not have to worry about naming collisions.

by using components like this

```
@component Example {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
  }
}
```

you can produce this CSS

```
.app-component.app-example {
  width: 100%;
  height: 100%;
}
.app-component.app-example .app-example_content {
  width: 100%;
}
```

## DOM helpers

CCSS is meant to be used in conjunction with a DOM helper, so you don't have to manually prefix anything.

- react?
- ember?
- angular?

CCSS is also meant to be used after a CSS preprocessor

- stylus?
- scss?
- less?

## stuff to know

if your CSS preprocessor doesn't support root properties inside of a component you can nest them inside of a `self` selector like this

```
@component Example {
  self {
    width: 100%;
    height: 100%;
  }
}
```

theres also the concept of states
```
@component Example {
	state::active {
		width: 100%;
	}

	.nested state::active {
		width: 100%;
	}
}
```
states reference the overall component state

## install

```
	npm install component-css
```

## usage 

```
var ccss = require('component-css');

ccss(/* Component Name */, /* source */, /* options */);
```

### options

- prefix (string)
- spacing (string)
- header (bool)