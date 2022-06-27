---
title: Some technical information about the Polyring widget
date: 2021-04-27T09:03:40+02:00
lastmod: 2021-04-27T09:03:40+02:00
description: Some technical information about the Polyring widget
draft: false
rssFullText: true
tags: ["css", "javascript", "web component"]
---

As those following the news about the Polyring may have read on [xyquadrat](https://xyquadrat.ch/2021/04/24/polyring-widget-theming.html), our widget can now be styled with themes. For those interested about the inner workings I will provide some technical information here. 

The component make heavy use of [css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) alongside the attribute `theme`, which can be set on the component. Let's walk through the needed setup, which consists of both javascript code and css descriptions.
<!--more-->

### Javascript setup
Fortunately webcomponents already have the functionally to observe attributes. We can simply declare an attribute as observable using a built-in funciton. This allows for hot-switching instead of only loading the attribute once in the beginning.
```js
static get observedAttributes() {
	return ['theme'];
}
```

Each time the value changes the triggered event can be observed with yet another built-in method. It's usually a good idea to check for the validity of this `newVal` and if it actually corresponds to our attribute. This is increasingly important if we observe more than just one attribute.
```js
attributeChangedCallback(attrName, oldVal, newVal) {
    if(attrName == "theme" && newVal && oldVal !== newVal) {
    	// act on new theme
    }
}
```

Using a lookup table we can then handle predefined themes, which makes it easier to embed. If the given value is not found in the table, we assume that it must be an url to an external file.
```js
themes = {
      default: "assets/themes/default.json",
      dark: "assets/themes/dark.json"
}

var url = this.themes[newVal] ?? newVal;
```

The corresponding internal or external file is then loaded, parsed as json and each css property is updated. You can find an example for such theme file on [xyquadrat](https://xyquadrat.ch/polyring/assets/themes/default.json).
```js
fetch(url).then(response => response.json())
    .then(val => {
    	for(var item in val) {
        	this.style.setProperty(item, val[item]);
         }              
	}).catch( val => {
    	console.error(val);
}); 
```

### CSS setup
A [css variable ](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) or css custom property can be used with the `var` function in css. For example for the webring-banner:
```css
.webring-banner {
    background-color: var(--background-color, #FFF);
    border: 1px solid var(--outer-border-color, #DDD);
}
```

Take note that `var`allows passing a default value in the format: `var(--my-variable, default_value)`, but it is not necessary. Basically every kind of css parameter can be used in a variable, so you could have dynamic borders or even hide an element in one theme. These variables can also be stacked to allow for both broad and specific control:

```css
.webring-banner__info {
	border: 2px solid var(--inner-border-color, var(--outer-border-color, #DDD));
}
```

Additionally if you're using scss and aren't keen on repeating the same var function for each component that uses these properties, you can integrate them with scss variables:
```scss
$text-color : var(--core-text-color, black);

.text {
	color: $text-color;
}
```

Unfortunately these css custom properties can not be used in scss functions like `scale-color`. As those are parsed at build time, but the value from a css variables is only present at run time. However css variables can be used in css functions like `calc`.

### Conclusion
Css custom properties allow for relatively easy theme support both to your website as well as webcomponents. Many css frameworks like [Materialize](https://materializecss.com/) or [Bootstrap](https://getbootstrap.com/) make heavy use of css variables to style elements dynamically.
