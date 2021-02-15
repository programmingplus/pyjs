import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";

export default {
  input: "index.js",
  output: {
    name: "PyJS",
    file: "dist/index.js",
    format: "umd",
  },
  plugins: [commonjs(), url({ include: ["**/*.mem", "**/*.data"], limit: Infinity })],
};
