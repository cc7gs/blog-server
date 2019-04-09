const { resolve } = require('path')
const r = path => resolve(__dirname, path)

//用于支持 es6语法
require('babel-core/register')({
  'presets': [
    'stage-3',
    ["latest-node", { "target": "current" }]
  ],
  'plugins': [
    'transform-decorators-legacy'
  ]
})

// require('babel-polyfill')
require('./app')