const presets = ['@babel/preset-env', '@babel/preset-typescript']

const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-class-properties',
]

const babelConfig = {
  presets,
  plugins,
}

module.exports = babelConfig
