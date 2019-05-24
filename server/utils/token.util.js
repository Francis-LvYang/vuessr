const jwt = require('jsonwebtoken')
const globalConfig = require('../config/global.config')

const { secret, expiresIn, algorithm } = globalConfig.jwt

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
      expiresIn
    }
  )
  return token
}
// 验证token
exports.verify = token => {
  const decoded = jwt.verify(token, secret)
  return decoded
}
