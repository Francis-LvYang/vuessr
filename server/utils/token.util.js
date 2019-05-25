const jwt = require('jsonwebtoken')
const globalConfig = require('../config/global.config')

const { secret, expiresIn, algorithm, psecret } = globalConfig.jwt
// token签名
exports.sign = user => {
  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
      userId: user._id,
      createdAt: user.createdAt
    },
    secret,
    {
      expiresIn,
      algorithm: algorithm
    }
  )
  return token
}
// 验证token
exports.verify = token => {
  try {
    const decoded = jwt.verify(token, psecret, { algorithm: algorithm }) || {}
    return decoded
  } catch (error) {
    return error
  }
}
