'use strict'

const MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/blogapi',
	prouri: 'mongodb://xxxxx@xxxxx/blogapi'
}

const QINIU = {
	accessKey: 'xxxxx',
	secretKey: 'xxxx',
	bucket: 'xxx',
	origin: 'img.store.ccwgs.top',
	uploadURL: 'xxxxxxxxxxxxxxxx'
}

const User = {
	jwtTokenSecret: 'cc_blog',
	defaultUsername: 'cc',
	defaultRealName:"吴晨晨",
	defaultPassword: 'xxxxxxxxxxxxxxxx'
}

const EMAIL = {
	account: 'chenorange12@gmail.com',
	password: 'xxxxxxxxxxxxxxxx'
}

const BAIDU = {
	site: 'www.ccwgs.top',
	token: 'xxxxxxxxxxxxxxxx'
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