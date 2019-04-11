import Router from 'koa-router'
import glob from 'glob'
import R from 'ramda'
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
    //引入所有路由
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require);
    // this.router.get('/', async (ctx) => {
    //   ctx.body = 'hello world';
    // })
    for (let [conf, controller] of routersMap) {
      const controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) prefixPath = normalizePath(prefixPath);
      const routerPath = prefixPath + conf.path;
      console.log(routerPath);
      this.router[conf.method](routerPath, ...controllers);
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

const decorate = (args, middleware) => {
  let [target, key, descriptor] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}
export const convert = middleware => (...args) => decorate(args, middleware)

// required装饰器
export const required = rules => convert(async (ctx, next) => {
  let errors = []

  const passRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
    }
  )

  passRules(rules)

  if (errors.length) ctx.throw(412, `${errors.join(', ')} 参数缺失`)

  await next()
})