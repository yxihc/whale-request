import dts from 'rollup-plugin-dts'
import typescript2 from 'rollup-plugin-typescript2'

import pkg from './../../packages/whale-request/package.json'
import RollUpConfig from './rollup.config'

/**
 * @type { import('rollup').RollupOptions }
 */
const TypesConfig = {
  // input: RollUpConfig.input,
  input: './../../packages/request-lib/index.ts',
  output: [{ file: pkg.types, format: 'esm' }],
  plugins: [dts(), typescript2()],
}

export default TypesConfig
