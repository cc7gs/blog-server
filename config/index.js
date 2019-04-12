'use strict'

const MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/blogapi',
	prouri: 'mongodb://xxxxx@xxxxx/blogapi'
}

const QINIU = {
	accessKey: 'LO2GBu-DVZ5bbWbIhFc8fpbjfMYGHmCmaOC4B9fl',
	secretKey: 'dYWT_ZXXt9wxNdBsr1Fii0tdDKoBDoLJyij_J7M6',
	bucket: 'blog',
	origin: 'img.store.ccwgs.top',
	uploadURL: 'http://img.store.ccwgs.top'
}

const User = {
	jwtTokenSecret: 'cc_blog',
	defaultUsername: 'cc',
	defaultRealName:"吴晨晨",
	defaultPassword: '123456'
}

const EMAIL = {
	account: 'chenorange12@gmail.com',
	password: 'cc101303'
}

const BAIDU = {
	site: 'www.ccwgs.top',
	token: '3yn82OHydGo0gNCI'
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