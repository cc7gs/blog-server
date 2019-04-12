'use strict'

import User from '../models/user'
import crypto from 'crypto'
/**
 * 注册用户
 * @param {*} opts 
 */
export const signUp = async (opts) => {
	return await (new User(opts)).save()
}

/**
 * 登录接口
 * @param {用户名} username 
 */
export const findOne = async (username) => {
	return await User.findOne({ username }).exec()
}

/**
 * 获取用户信息
 * @param {用户名} username 
 */
export const getUserInfo = async (username) => {
	return await User.findOne({ username }, 'name username slogan gravatar role')
}


/**
 * 编辑用户
 * @param {*} opts 
 */
export const md5Decode = pwd => crypto.createHash('md5').update(pwd).digest('hex')
export const edit = async (opts = {}) => {

	const { name, username, slogan, gravatar, oldPassword, newPassword } = opts
	const user = await User.findOne({ username }, '_id name slogan gravatar password role')
	if (user) {
		if (user.password !== md5Decode(oldPassword)) {
			return new Error('密码不正确')
		} else{
			console.log('xxx',user._id);
			const password = newPassword === '' ? oldPassword : newPassword
			let editeUser = await User.findByIdAndUpdate(user._id, { slogan, gravatar, password: md5Decode(password) }, { new: true })
			console.log(editeUser, 'editUser');
			if (editeUser) {
				return editeUser;
			} else {
				return new Error('修改用户资料失败')
			}
		}
	} else {
		return new Error('修改用户资料失败')
	}
}
