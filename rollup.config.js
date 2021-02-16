import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";

const replaceNodeModules = {
  resolveId(source) {
    if (["path", "fs", "crypto", "child_process"].includes(source)) return "rollup\0empty-module";
    return null;
  },
  load(id) {
    if (id === "rollup\0empty-module") return "export {}";
    return null;
  },
};

export default {
  input: "index.js",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
    },
  ],
  plugins: [commonjs(), url({ include: ["**/*.js.mem", "**/*.data"], limit: Infinity }), replaceNodeModules],
};
