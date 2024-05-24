import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'

import pkg from './../../packages/whale-request/package.json'

/**
 * @type { import('rollup').RollupOptions }
 */
const RollUpConfig = {
  input: './../../packages/whale-request/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
    },
    {
      name: 'WhaleRequest',
      file: pkg.main,
      format: 'commonjs',
      exports: 'named',
    },
    {
      name: 'WhaleRequest',
      file: pkg.unpkg,
      format: 'umd',
      exports: 'named',
      extend: true,
      plugins: [terser()],
      globals: {
        lodash: 'lodash-unified',
      },
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript2({
      tsconfigOverride: {
        exclude: ['node_modules', 'examples', 'internal'],
      },
    }),
    babel({
      extensions: ['js', 'ts', 'tsx'],
      babelHelpers: 'runtime',
      configFile: './babel.config.js',
      exclude: [/core-js/],
    }),
  ],
}

export default RollUpConfig
