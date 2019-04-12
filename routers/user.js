'use strict'

// 用户路由
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'

import { signUp, findOne, edit,md5Decode} from '../controllers/user'

import { resError, resSuccess } from '../utils/resHandle'

// md5 编码


@controller(`${config.APP.ROOT_PATH}/user`)
export class userController {
	// 注册用户
	@post('signup')
	@required({ body: ['username', 'password'] })
	async addUser(ctx, next) {
		const { username, password } = ctx.request.body;
		try {
			let result = await findOne(username);
			if (!result) {
				const decPassword = md5Decode(password);
				const user = await signUp({ username, password: decPassword })
				console.log(user, '添加用户');
				resSuccess({ ctx, message: '添加用户成功' })

			} else {
				resError({ ctx, message: '用户已经存在,' })
			}
		} catch (err) {
			resError({ ctx, message: '添加用户失败', err })
		}
	}
	// 登录
	@post('login')
	@required({ body: ['username', 'password'] })
	async Login(ctx, next) {
		const { username, password } = ctx.request.body
		try {
			const user = await findOne(username)
			//WebToken 保存时间
			const expDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
			if (user) {
				if (user.password === md5Decode(password)) {
					const token = jwt.sign({
						name: user.name,
						password: user.password,
						exp: expDate
					}, config.User.jwtTokenSecret)
					resSuccess({ ctx, result: { token, lifeTime: expDate, user }, message: "登陆成功" })
				} else {
					resError({ ctx, message: "密码错误!" })
				}
			} else {
				resError({ ctx, message: "账户不存在" })
			}
		} catch (err) {
			resError({ ctx, message: '查询内部失败', err })
			console.log(err);
		}
	}
	//修改资料
	@put('edit')
	@required({ body: ['newPassword', 'oldPassword'] })
	async editInfo(ctx, next) {
		const opts = ctx.request.body;
		try {
			const editUser=await edit(opts);
			if(editUser){
				resSuccess({ ctx, message: "修改成功", result: editUser })
			}
		} catch (error) {
			resError({ ctx, message: '修改内部失败', error })
			console.log(error);
		}
	}
}
