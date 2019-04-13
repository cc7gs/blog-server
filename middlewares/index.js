import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import Interceptor from './interceptor'
import helmet from 'koa-helmet' // 安全相关
export const middlewares=(app)=>{
  //统计每次 api请求时间
  app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start
		console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })

  //设置跨域
  app.use(cors({
    origin:true
  }))
  app.use(Interceptor)
  app.use(helmet())
  app.use(bodyParser({
    jsonLimit:'10mb',
    formLimit:'10mb',
    textLimit:'10mb'
  }))
  //404 500
  app.use(async (ctx,next)=>{
    try {
      await next()
    } catch (error) {
      ctx.body={error};
    }
    if(ctx.status===404 || ctx.status===405){
      ctx.body={code:0,message:'无效api请求'}
    }
  })
}