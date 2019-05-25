const mongoose = require('mongoose')
const User = mongoose.model('User')
const token = require('../utils/token.util')

exports.auth = (name,
(required = true) => async (req, res, next) => {
  const t = req.cookies[name] || req.get(name)
  if (!t) {
    res.json({
      success: false,
      message: '请登录后操作'
    })
    return
  }
  try {
    const userInfo = token.verify(t)
    res.locals.user = userInfo || {}
    next()
  } catch (error) {
    res.clearCookie(name)
    res.json({
      code: 404,
      data: 'Toekn 失效',
      error
    })
  }
})

// 针对token非必须的get接口
exports.filter = name => (req, res, next) => {
  const t = req.cookies[name] || req.get(name)
  res.locals.user = {}
  if (t) {
    try {
      const userInfo = token.verify(t)
      res.locals.user = userInfo || {}
    } catch (error) {
      res.locals.user = {}
    }
  }
}
