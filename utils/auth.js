/* auth验证方法 */
import config from '../config';
import jwt from 'jsonwebtoken'

// 验证Auth
const authToken = req => {
	if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    console.log(parts,'token');
		if (Object.is(parts.length, 2) && Object.is(parts[0], 'CcBlog')) {
			return parts[1]
		}
	}
	return false
}

// 验证权限
const authIsVerified = req => {
	const token = authToken(req);
	console.log(token,'token');
	if (token) {
		try {
			const decodedToken = jwt.verify(token, config.User.jwtTokenSecret)
			if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
				return true
			}
		} catch (err) {
			console.log(err)
		}
	}
	return false
}

module.exports = authIsVerified