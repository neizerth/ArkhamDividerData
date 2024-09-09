import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs'
  },
  plugins: [
    json(),
    typescript({
    }),
    typescriptPaths({
      nonRelative: true,
    }),
  ]
};