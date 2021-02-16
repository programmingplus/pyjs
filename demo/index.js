import * as PyJS from "./pyjs.js";

document.getElementById("loading-indicator").style.display = "none";

const term = new Terminal({
  fontSize: 14,
  lineHeight: 1.6,
  fontFamily:
    '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.loadAddon(new Unicode11Addon.Unicode11Addon());
term.unicode.activeVersion = "11";
term.open(document.getElementById("terminal"));
fitAddon.fit();
const observer = new ResizeObserver((mutations) => void fitAddon.fit());
observer.observe(document.getElementById("terminal"));
term.write(`# click the "Run" button above\r\n`);

const run = document.getElementById("run");
run.disabled = false;
run.addEventListener("click", async () => {
  term.reset();
  run.disabled = true;
  const write = (s) => void term.write(s.replace(/\n/g, "\r\n"));
  let stdinBuffer = "";
  let resolveStdinBufferPromise;
  let stdinBufferPromise;
  const resetStdinBuffer = () => {
    stdinBuffer = "";
    stdinBufferPromise = new Promise((resolve) => void (resolveStdinBufferPromise = resolve));
  };
  resetStdinBuffer();
  let lineBuffer = [];
  let lineBufferPos = 0;
  const appendLineBuffer = (s) => {
    const appendix = [...s];
    lineBuffer = [...lineBuffer.slice(0, lineBufferPos), ...appendix, ...lineBuffer.slice(lineBufferPos)];
    lineBufferPos += appendix.length;
  };
  const flushSuffix = () => {
    const appendix = lineBuffer.slice(lineBufferPos).join("");
    const appendixLength = term._core.unicodeService.getStringCellWidth(appendix);
    if (appendixLength > 0) {
      term.write(`${appendix}\x1b[${appendixLength}D`);
    }
  };
  const onDataEvent = term.onData((data) => {
    switch (data) {
      case "\r": // enter
        term.write("\r\n");
        stdinBuffer += lineBuffer.join("") + "\n";
        lineBuffer = [];
        lineBufferPos = 0;
        resolveStdinBufferPromise();
        break;
      case "\x7f": // backspace
        if (lineBufferPos > 0) {
          term.write(`\x1b[${term._core.unicodeService.getStringCellWidth(lineBuffer[lineBufferPos - 1])}D\x1b[K`);
          lineBuffer.splice(lineBufferPos - 1, 1);
          lineBufferPos--;
          flushSuffix();
        }
        break;
      case "\x1b[A": // arrow up
      case "\x1b[B": // arrow down
        break;
      case "\x1b[D": // arrow left
        if (lineBufferPos > 0) {
          lineBufferPos--;
          term.write(`\x1b[${term._core.unicodeService.getStringCellWidth(lineBuffer[lineBufferPos])}D`);
        }
        break;
      case "\x1b[C": // arrow right
        if (lineBufferPos < lineBuffer.length) {
          term.write(`\x1b[${term._core.unicodeService.getStringCellWidth(lineBuffer[lineBufferPos])}C`);
          lineBufferPos++;
        }
        break;
      default: {
        term.write(data);
        appendLineBuffer(data);
        term.write("\x1b[K");
        flushSuffix();
      }
    }
  });
  try {
    await PyJS.run(document.getElementById("editor").value, {
      writeStdout: write,
      writeStderr: write,
      readStdin: async () => {
        term.focus();
        await stdinBufferPromise;
        const buffer = stdinBuffer;
        resetStdinBuffer();
        return buffer;
      },
    });
    term.write("\r\n\x1b[1;30m[Program terminated]\x1b[0m\r\n");
  } catch (error) {
    term.write(`\r\n\x1b[1;31m${error.message}\x1b[0m\r\n`);
  }
  onDataEvent.dispose();
  run.disabled = false;
});
