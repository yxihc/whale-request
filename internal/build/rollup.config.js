import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'
import { visualizer } from 'rollup-plugin-visualizer'
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
      file: pkg.unpkg,
      format: 'umd',
      name: 'WhaleRequest',
      plugins: [terser()],
    },
    {
      name: 'WhaleRequest',
      file: pkg.main,
      format: 'commonjs',
      exports: 'named',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript2(),
    babel({
      extensions: ['js', 'ts', 'tsx'],
      babelHelpers: 'runtime',
      configFile: './babel.config.js',
      exclude: 'node_modules/**',
    }),
    visualizer(),
  ],
}

export default RollUpConfig
