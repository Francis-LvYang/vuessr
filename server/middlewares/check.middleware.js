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
  }
})
