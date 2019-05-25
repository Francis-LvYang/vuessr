const router = require('express').Router()
const user = require('../controllers/user.controller')
const check = require('../middlewares/check.middleware')

// 获取用户信息
router.get('/users', check.auth('token'), user.getUsers)
// token 验证获取用户
router.get('/user', check.auth('token'), user.getUserInfo)
// 验证码路由
router.get('/get-img-verify', user.getcode)
// 登录路由
router.post(
  '/login',
  check.formData(['username', 'password', 'code']),
  user.login
)
// 注册路由
router.post(
  '/user',
  check.formData(['username', 'email', 'password']),
  user.postUser
)
module.exports = router
