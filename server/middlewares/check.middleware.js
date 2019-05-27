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
// 检查请求该接口的用户角色
exports.role = roleName => (req, res, next) => {
  const { role } = req.locals.user
  if (role !== roleName) {
    res.status(403).json({
      code: 403,
      data: '没有权限'
    })
  }
  next()
}

// array or string
exports.query = field => (req, res, next) => {
  const hasParam =
    typeof field === 'string'
      ? !!req.query[field]
      : field.every(item => !!req.query[item])
  if (!hasParam) {
    const fields = typeof field === 'string' ? [field] : field
    res.json({
      code: 200,
      data: `${fields.json('、')} 是必填字段`
    })
  }
  next()
}

// array or string
exports.formData = field => (req, res, next) => {
  const hasParam =
    typeof field === 'string'
      ? !!req.body[field]
      : field.every(item => !!req.body[item])
  if (!hasParam) {
    const fields = typeof field === 'string' ? [field] : field
    res.json({
      code: 200,
      data: `${fields.json('、')}是必填字段`
    })
  }
  next()
}
