const presets = [
  [
    '@babel/preset-env',
    {
      targets: '> 0.25%, not dead',
    },
  ],
  '@babel/preset-typescript',
]
const plugins = [
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: true,
    },
  ],
]

const babelConfig = {
  presets,
  plugins,
}

if (process.env.NODE_ENV === 'test') {
  babelConfig.plugins.push('@babel/plugin-transform-runtime')
  babelConfig.targets = { node: 'current' }
} else {
  babelConfig.plugins.push([
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
    },
  ])
}

module.exports = babelConfig
