import Router from 'koa-router'

export default class Route {
  constructor(app, apiPath) {
    this.app = app;
    //实例路由
    this.router = new Router();
    this.apiPath = apiPath;
  }
  //引入所有路由
  init() {
      
    // this.router.get('/', async (ctx) => {
    //   ctx.body = 'hello world';
    // })

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}