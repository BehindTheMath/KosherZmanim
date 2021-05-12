import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/kosher-zmanim.ts',
  output: [
    {
      file: 'dist/kosher-zmanim.js',
      format: 'umd',
      name: 'KosherZmanim',
      sourcemap: true,
    },
    {
      file: 'dist/kosher-zmanim.min.js',
      format: 'umd',
      name: 'KosherZmanim',
      sourcemap: true,
      plugins: [
        terser(),
      ],
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'src/tsconfig.json',
      module: 'ESNext',
      target: 'es6',
    }),
    nodeResolve(),
    commonjs(),
  ],
};
