import Koa from 'koa'
import config from './config'
import mongoConnect from './mongodb'
import Route from './decorator/router'
import {middlewares} from './middlewares'
import { resolve } from 'path';

import fs from 'fs'
const app = new Koa();
//连接数据库
mongoConnect();

//使用中间件
middlewares(app);
//引用路由
const router = new Route(app, resolve(__dirname, './routers'))
router.router.get('/',async (ctx)=>{
  ctx.response.type='html'
  ctx.body=await fs.readFileSync(__dirname+'/fileupload.html','utf-8');
})
//初始化路由
router.init();
//启动服务
app.listen(config.APP.PORT, () => {
  console.log(`node-koa api run port at ${config.APP.PORT}`);
})
