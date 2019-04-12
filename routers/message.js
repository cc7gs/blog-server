//留言路由
import xss from 'xss'
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import { putMessage, delectMessage, 
		editeMessage, getMessage} from '../controllers/message'

import {resError, resSuccess} from '../utils/resHandle'

@controller(`${config.APP.ROOT_PATH}/message`)
export class MessageController {
	// 添加留言
	@post('add')
	@required({body: ['content', 'author']})
	async addMessage (ctx, next) {
		let opts = ctx.request.body
		opts.content = xss(opts.content)
		try {
			let article = await putMessage(ctx, opts)
			resSuccess({ ctx, message: '添加留言成功'})
		} catch (err) {
      console.log(err);
			resError({ ctx, message: '添加留言失败', err})
		}
	}
	// 获取留言
	@get('get')
	async toGetMessage (ctx, next) {
		try {
			const res = await getMessage(ctx.query)
			resSuccess({ ctx, message: '获取留言成功', result: res})
		} catch(err) {
			resError({ ctx, message: '获取留言失败', err})
		}
	}
	// 删除评论
	@del('delete/:id')
	async removeMessage (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await delectMessage(id)
				resSuccess({ ctx, message: '删除留言成功'})
			} catch(err) {
				resError({ ctx, message: '删除留言失败', err})
			}
		} else {
			resError({ ctx, message: '删除留言失败', err: '缺少参数id'})
		}
	}
	// 编辑评论
	@put('edit/:id')
	async toEditeReply (ctx, next) {
		const { id } = ctx.params
		if (id) {
			try {
				const res = await editeMessage(id, ctx.request.body)
				resSuccess({ ctx, message: '修改留言成功'})
			} catch(err) {
				resError({ ctx, message: '修改留言失败', err: err})
			}
		} else {
			resError({ ctx, message: '修改留言失败', err: '地址缺少参数id'})
		}
	}
}
