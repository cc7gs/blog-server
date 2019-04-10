const { resolve } = require('path')
//用于支持 es6语法
require('babel-register')({
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