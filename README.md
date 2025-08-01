# mac-window.js

[](https://opensource.org/licenses/MIT)

A lightweight, zero-dependency JavaScript library for creating beautiful, interactive, and configurable macOS-style windows on your web pages.

This library is designed to be framework-friendly, modifying your elements in-place to ensure seamless integration with SPAs (like React, Vue, Angular) and other libraries.

## Live Demo

**[➡️ Click here for a live demo](https://kevinhuang001.github.io/mac-window.js/)**

## Features

  - **macOS Aesthetics**: Faithfully recreates the modern macOS window look and feel with pure CSS.
  - **Fully Interactive**: Windows can be dragged, maximized, restored, and minimized to a dock.
  - **Performant**: Dragging is GPU-accelerated using `transform` for a silky-smooth experience.
  - **Highly Configurable**: Control size, position, initial state, and more via simple HTML attributes.
  - **Global Settings**: Fine-tune fullscreen behavior for all windows with a global configuration object.
  - **Framework-Friendly**: Modifies elements in-place without moving them in the DOM tree, ensuring compatibility.
  - **Zero Dependencies**: Plain vanilla JavaScript and CSS. Lightweight and fast.

## Getting Started

Using `mac-window.js` is simple. Just include the CSS and JS files and add the `mac-window` attribute to any `<div>`.

### 1\. Include the files

Link the `mac-window.css` in the `<head>` of your HTML file and the `mac-window.js` script at the end of your `<body>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Awesome App</title>
    <link rel="stylesheet" href="path/to/mac-window.css">
</head>
<body>
    <script src="path/to/mac-window.js"></script>
</body>
</html>
```

### 2\. Create a Window

Add the `mac-window` attribute to any `<div>`. The library will automatically find and transform it.

```html
<div mac-window mac-window-title="My First Window">
    <h1>Hello, World!</h1>
    <p>This is the content of my first window.</p>
</div>
```

## Configuration & API

You can configure windows on a per-window basis using HTML attributes or globally using a JavaScript object.

### HTML Attributes (Per-Window)

| Attribute                   | Description                                                                                                                              | Example                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `mac-window`                | **(Required)** Activates the library on this `<div>`.                                                                                    | `<div mac-window>`                    |
| `mac-window-title`          | Sets the title displayed in the window's title bar.                                                                                      | `mac-window-title="My Notes"`         |
| `mac-window-width`          | Sets the initial width of the window.                                                                                                    | `mac-window-width="600px"`            |
| `mac-window-height`         | Sets the initial height of the window.                                                                                                   | `mac-window-height="400px"`           |
| `mac-window-top`            | Sets the initial vertical position from the top of the viewport.                                                                         | `mac-window-top="100px"`              |
| `mac-window-left`           | Sets the initial horizontal position from the left of the viewport.                                                                      | `mac-window-left="150px"`             |
| `mac-window-initial-state`  | Sets the starting state of the window. Can be `"maximized"` or `"minimized"`.                                                            | `mac-window-initial-state="maximized"` |
| `mac-window-flush-content`  | Removes all padding from the content area, making the content flush with the window frame. Ideal for `<iframe>`s or images. | `<div mac-window-flush-content>`      |

### Global Configuration (JavaScript)

For advanced control, you can define a global configuration object **before** including the `mac-window.js` script. This is ideal for setting fullscreen offsets.

```html
<script>
  // Define global config before the library script
  window.macWindowConfig = {
    fullscreenOffsetX: '0px',
    fullscreenOffsetY: '0px',
    fullscreenWidth: '100vw',
    fullscreenHeight: '100vh'
  };
</script>
<script src="path/to/mac-window.js"></script>
```

| Property             | Default    | Description                                                                                             |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `fullscreenOffsetX`  | `'0px'`      | A global horizontal offset for all windows when maximized.                                              |
| `fullscreenOffsetY`  | `'0px'`      | A global vertical offset for all windows when maximized.                                                |
| `fullscreenWidth`    | `'100vw'`    | The global width for all windows when maximized. Can be `'100%'` or a `calc()` value.                   |
| `fullscreenHeight`   | `'100vh'`    | The global height for all windows when maximized.                                                       |

**For most standard layouts without transformed parent containers, the default configuration will work perfectly without any adjustments.**

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.