---
title: "Loading Sass files with Lit"
subtitle: ""
date: 2022-07-18T16:11:44+02:00
lastmod: 2022-07-18T16:11:44+02:00
draft: false

description: "Loading Sass files with Lit"
images: []

tags: ["css", "javascript", "web component"]

rssFullText: true
---

Like [Polymer](https://polymer-library.polymer-project.org/) before, [Lit-Element](https://lit.dev/) uses javascript or typescript files for code, templates and styles by default, to enable the use of javascript variables. While this may be useful in some cases, personally I prefer having my style definitions in separate files mainly to benefit from [Sass](https://sass-lang.com/), but also the added benefit of editor assistance like highlighting and autocompletion. Fortunately this can be changed with a bundler like [Webpack](https://webpack.js.org/).

<!--more-->

{{< admonition tip "What is Lit?" false >}}
Lit Element is a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) library. It adds some useful boilerplate and typescript definitions on top of the Web Component standards.
A Web Component itself is simply a custom element like any other default html element. But they encapsulate their code and styling from the rest of the page, which makes them highly modular. In a way their job is similar to classes in object-oriented programming languages.

Many well known Libraries like [Angular](https://angular.io/) or [React](https://reactjs.org/) make heavy use of Web Components.
{{< /admonition >}}

### Previous Setup

Previously with Polymer I used the [polymer-css-loader](https://github.com/superjose/polymer-css-loader) alongside its requirements to import stylesheets in javascript modules.

```js
config = {
  ...,
  module: {
    rules: [
      ...,
      {
        test: /\.css|\.s(c|a)ss$/,
        use: [
          babel, {
          loader: 'polymer-css-loader',
          options: {
            minify: true,
            url: false
          },
        }, 'extract-loader', 'css-loader', 'resolve-url-loader','sass-loader?sourceMap']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
            outputPath: 'assets'
          }
        }]
      },
    ]
  }
}
```

There actually exists a continuation of it for lit elements called [lit-css-loader](https://github.com/bennypowers/lit-css). Unfortunately [extract-loader](https://github.com/peerigon/extract-loader) seems to be broken in Webpack 5, especially when loading images from Sass files.

### New Setup

Instead the [css-loader](https://webpack.js.org/loaders/css-loader/) can now be used on its own to export the stylesheets in the required format.

```js
config = {
  ...,
  module: {
    rules: [
      ...,
      {
        test: /\.css|\.s(c|a)ss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              exportType: "css-style-sheet",
            }
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
        generator: {
          filename: 'assets/images/[name].[ext]'
        }
      }
    ]
  }
}
```

Some details about the different loaders used:

 - [sass-loader](https://www.npmjs.com/package/sass-loader) is needed to compile sass to pure css.
 - Webpack expects relative paths to be in relation to the root file. To fix this [resolve-url-loader](https://www.npmjs.com/package/resolve-url-loader) re-writes those paths to correctly load files.
 - Then css-loader translates CSS to Javascript.
 - The url-loader to load images has now been replaced by the [Asset Module](https://webpack.js.org/guides/asset-modules/) from Webpack 5. Images smaller than 4kb will be inlined, while larger images are stores as a separate file.

Hopefully this quick summary will save you some time if you are working with Lit-Elements.

### Additional remarks

As the [CSS Module Scripts](https://web.dev/css-module-scripts/) feature gets deployed to all browsers this setup might become simpler.