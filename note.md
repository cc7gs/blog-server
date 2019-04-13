- 配置babel 在nodejs中支持 import/export
-  同步加载文件 
```javascript
glob.sync(resolve(this.apiPath,'./*.js')).forEach(res=>{
        console.log(res,'res');
})
```
# 安全相关
helmet 可以隐藏 HTTP header中 x-开头的信息,免受攻击者获取网站信息,从而提升应用安全性
# 搭建node 环境
## 通过babel 搭建node环境

> npm install --save-dev babel-register
> npm install --save-dev babel-plugin-transform-decorators-legacy 
//支持装饰器语法
> npm install --save-dev babel-preset-stage-3
//
> npm install --save-dev babel-preset-env 
// 我们可以使用babel-preset-env这个插件，它会自动检测当前node版本，只转码node不支持的语法，非常方便
> npm install --save babel-polyfill 
// babel转码时不能识别一些全局对象的API，例如Object.assign，使用它可以解决这个问题
```javascript
//start.js
require('babel-register')({
  // "presets": [
  //   "stage-3",
  //   ["env",{
  //     "targets":{
  //       "node":'current'
  //     }
  //   }]
  // ],
  "plugins":[
    'transform-decorators-legacy'
  ]
})
require('babel-polyfill');
require('./test.js');

//test.js
const router = conf => (target, key, desc) => {
  console.log(conf, target, key, desc, '----')
}
const post = path => {
  console.log('path', path);
  return router({
    path,
  });
}


class UserController {
  @post('login')
  login() {

  }
}
const a = async () => {
  console.log('await test a')
  return await 1;

}
console.log(a(),'await ');
```
> node start.js //启动项目

## 通过 typeScirpt
**根目录新建tsconfig.json**
```javascript
{
  "compilerOptions": {
    "declaration": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "es2015",
      "es2016",
      "es2017",
      "es2018",
      "esnext",
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitThis": false,
    "noImplicitReturns": true,
    "outDir": "dist",
    "sourceMap": false,
    "strict": true,
    "target": "es2015",
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```
> npm -g typscript  //ts 全局安装
> tsc //项目根目录下 
通过ts进行语法转换,然后运行 打包后的文件。
# 通过装饰器改造路由

**对路由封装**
```javascript
import Router from 'koa-router'
import glob from 'glob'
import { resolve } from 'path';
import _ from 'lodash';
/**
 * 以键值对存放路由信息
 * key {
 *    target  //存放路由前缀
 *    method  请求方法
 *    path 请求路由
 * }
 * value 存放被装饰器过后的方法
 *  */
export let routersMap = new Map();
export const symbolPrefix = Symbol('prefix');
export const isArray = v => _.isArray(v) ? v : [v]
//给路径添加前缀 /
export const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

export default class Route {
  constructor(app, apiPath) {
    this.app = app;
    //实例路由
    this.router = new Router();
    this.apiPath = apiPath;
  }
  //
  init() {
    //引入所有路由文件
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require);
    // this.router.get('/', async (ctx) => {
    //   ctx.body = 'hello world';
    // })
    //挂载路由
    for (let [conf, controller] of routersMap) {
      const controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) prefixPath = normalizePath(prefixPath);
      const routerPath = prefixPath + conf.path;
      this.router[conf.method](routerPath,...controllers);
    }
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)
  routersMap.set({
    target: target,
    ...conf
  }, target[key])
}
// controller装饰器
export const controller = path => target => target.prototype[symbolPrefix] = path

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'delete',
  path: path
})


```
**新建routersm目录**
```javascript
//routers/user
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import {resError, resSuccess} from '../utils/resHandle'
@controller(`${config.APP.ROOT_PATH}/user`)
export class userController{
  //获取用户信息
  @get('/:id')
  async getUserInfo(ctx){
    resSuccess({ctx,message:'获取用户信息',result:ctx.params})
  }
  //登录
  @post('login')  
  async Login(ctx,next){
      const {username,password}=ctx.request.body;
      try {
        resSuccess({ctx,message:'login success'})
      } catch (error) {
        resError({ ctx, message: "login Error!" })
      }
    }
    //退出
    async LoginOut(ctx,next){
      
    }
}
```
**信息反馈的封装**
```javascript
//对请求响应统一处理
export const resError = ({ ctx, message = '请求失败', err = null }) => {
	ctx.body = { code: 0, message, debug: err }
}

export const resSuccess = ({ ctx, message = '请求成功', result = null }) => {
	ctx.body = { code: 1, message, result }
}
```
**新建启动文件和主文件**
```javascript
//start.js
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

require('babel-polyfill')
require('./app')

//app.js
import Koa from 'koa'
import config from './config'
import Route from './decorator/router'
import { resolve } from 'path';
const app = new Koa();

//使用中间件
//引用路由
const router = new Route(app, resolve(__dirname, './routers'))
//初始化路由
router.init();
//启动服务
app.listen(config.APP.PORT, () => {
  console.log(`node-koa api run port at ${config.APP.PORT}`);
})
```
**关于配置文件**
```javascript
const APP = {
	ROOT_PATH: '/api',
	LIMIT: 10,
	PORT: 3009
}
export default{
  APP
}
```
本文来自对 [naice-blog-koa](https://github.com/naihe138/naice-blog-koa) 学习仅供参考。