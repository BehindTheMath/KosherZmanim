import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [esbuild(), resolve()],
    output: [
      {
        file: `lib/bundle.js`,
        format: 'esm',
        sourcemap: true,
      },
    ]
  },
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [dts(), resolve()],
    output: {
      file: `lib/bundle.d.ts`,
      format: 'es',
    },
  }
]