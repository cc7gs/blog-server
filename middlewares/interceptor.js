'use strict'

const authIsVerified = require('../utils/auth');

export default async (ctx, next) => {
	// 拦截器
	const allowedOrigins = ['https://blog.ccwgs.top', 'https://blog.admin.ccwgs.top', 'file://'];
	const origin = ctx.request.headers.origin || '';
	if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
		ctx.set('Access-Control-Allow-Origin', origin);
	};

	ctx.set({
		'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
		'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
		'Access-Control-Max-Age': '1728000',
		'Content-Type': 'application/json;charset=utf-8',
		'X-Powered-By': 'cc_blog 1.0.0'
	});

	// OPTIONS
	if (ctx.request.method == 'OPTIONS') {
		ctx.status = 200;
		return false;
	};

	// 如果是生产环境，需要验证用户来源渠道，防止非正常请求
	if (Object.is(process.env.NODE_ENV, 'production')) {
		const { origin, referer } = ctx.request.headers;
		if (origin !== 'file://') {
			const originVerified = (!origin	|| origin.includes('ccwgs.top')) && (!referer || referer.includes('ccwgs.top'))
			if (!originVerified) {
				ctx.throw(403, { code: 0, message: '身份验证失败！' })
				return false;
			};
		}
	};
	// 排除auth的post请求 && 评论的post请求 && like请求 && hero post
	const isLike = ctx.request.url.indexOf('api/article/like') >= 0 && Object.is(ctx.request.method, 'POST');
	const isCommentLike = ctx.request.url.indexOf('api/comment/like') >= 0 && Object.is(ctx.request.method, 'POST');
	// const isPostAuth = Object.is(ctx.request.url, '/api/auth') && Object.is(ctx.request.method, 'POST');
	const isLogin = ctx.request.url.indexOf('api/user/login') >= 0 && Object.is(ctx.request.method, 'POST');
	const isHero = Object.is(ctx.request.url, 'api/message/add') && Object.is(ctx.request.method, 'POST');
	const isPostComment = Object.is(ctx.request.url, '/api/comment/add') && Object.is(ctx.request.method, 'POST');
	const isPostReply = Object.is(ctx.request.url, '/api/reply/add') && Object.is(ctx.request.method, 'POST');
	if (isLike || isCommentLike || isPostComment || isLogin || isHero || isPostReply) {
		await next();
		return false;
	};
	// 拦截所有非管路员的非get请求
	if (!authIsVerified(ctx.request) && !Object.is(ctx.request.method, 'GET')) {
		console.log(ctx.request,'api请求------------------------------------------');
		ctx.throw(401, { code: -2, message: '身份验证失败！' })
		return false;
	};

	await next();
}