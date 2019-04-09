import Koa from 'koa'
import config from './config'
import mongoConnect from './mongodb'
import Route from './decorator/router'
import { resolve } from 'path';
const app = new Koa();
//连接数据库
mongoConnect();

//使用中间件
//引用路由
const router = new Route(app, resolve(__dirname, './routers'))
//初始化路由
router.init();
//启动服务
app.listen(config.APP.PORT, () => {
  console.log(`node-koa api run port at ${config.APP.PORT}`);
})