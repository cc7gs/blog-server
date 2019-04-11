'use strict'

const MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/blogapi',
	prouri: 'mongodb://xxxxx@xxxxx/blogapi'
}

const QINIU = {
	accessKey: 'your_qn_accessKey',
	secretKey: 'your_qn_secretKey',
	bucket: 'naice',
	origin: 'xxxxxx',
	uploadURL: 'your_qn_uploadURL'
}

const User = {
	jwtTokenSecret: 'cc_blog',
	defaultUsername: 'cc',
	defaultPassword: '123456'
}

const EMAIL = {
	account: 'chenorange12@gmail.com',
	password: 'cc101303'
}

const BAIDU = {
	site: 'blog.ccwgs.top',
	token: 'xxxxxxx'
}

const APP = {
	ROOT_PATH: '/api',
	LIMIT: 10,
	PORT: 3009
}

const INFO = {
	name: 'cc_blog',
	version: '1.0.0',
	author: 'cc',
	site: 'https://ccwgs.top',
	powered: ['React', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}

export default {
	MONGODB,
	QINIU,
	User,
	EMAIL,
	BAIDU,
	APP,
	INFO
}