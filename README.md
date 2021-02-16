# PyJS

> Python (CPython) in the browser.

[Demo](https://pyjs.programming.plus/demo/)

## Getting Started

You can import PyJS from CDN directly:

```html
<pre id="output"></pre>

<script type="module">
  import { run } from "https://cdn.jsdelivr.net/npm/@programmingplus/pyjs";

  const output = (s) => (document.getElementById("output").textContent += s);
  run(`print(42 ** 42)`, { writeStdout: output, writeStderr: output });
</script>
```

Or, you may install PyJS with npm:

```sh
$ npm install --save @programmingplus/pyjs
```

## Purpose

To port CPython to the browser for education so that people can

- run simple Python code directly in the browser
- type things to standard input interactively
- retrieve data from standard output and standard error
