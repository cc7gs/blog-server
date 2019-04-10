//用户路由
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