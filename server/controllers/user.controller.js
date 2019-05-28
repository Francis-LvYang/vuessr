const mongoose = require('mongoose')
const md5 = require('md5')
const _ = require('lodash')
const svgCaprcha = require('svg-captcha')
const globalConfig = require('../config/global.config')
const token = require('../utils/token.util')

const User = mongoose.model('User')
// 验证码controller
exports.getcode = async (req, res, next) => {
  const code = await svgCaprcha.create({
    size: 5,
    ignoreChars: '0o1i',
    noise: 2,
    color: true,
    background: '#cc9966'
  })
  res.cookies('code', md5(code.text), {
    maxAge: globalConfig.jwt.expiresIn,
    httpOnly: true
  })
  res.send({
    img: code.data
  })
}
// 注册路由controller
exports.postUser = async (req, res, next) => {
  const { body } = req
  const email = await User.findOne({
    email: body.email
  }).exec()
  if (email) {
    res.json({
      success: 404,
      message: '邮箱已经被注册'
    })
  }
  const username = await User.findOne({
    username: body.username
  }).exec()
  if (username) {
    res.json({
      code: 404,
      message: '用户名已被使用'
    })
  }
  // 注册逻辑
  try {
    // 生成随机头像
    const avatar = body.avatar
      ? body.avatar
      : `${globalConfig.app.domain}/public/avatar/${_.random(1, 9)}.jpg`
    const user = await new User({
      ...body,
      avatar
    }).save()
    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    res.json({
      code: 404,
      data: '注册失败',
      error
    })
  }
}
// 登录控制controller
exports.login = async (req, res, next) => {
  const { body } = req
  const password = body.password
  if (md5(body.code) !== req.cookies.code) {
    res.json({
      success: false,
      message: '请输入正确的验证码'
    })
  }
  try {
    const user = await User.findOne({
      email: body.username,
      password: body.password
    }).exec()
    if (user) {
      if (password !== null) {
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            res.send(err)
          }
          if (isMatch) {
            const t = token.sign(user)
            res.cookie('token', t, {
              maxAge: globalConfig.jwt.expiresIn,
              httpOnly: true
            })
            res.clearCookie('code')
            res.json({
              code: 200,
              success: true,
              data: {
                token: t,
                data: '登录成功'
              }
            })
          } else {
            res.json({
              code: 404,
              data: '密码错误'
            })
          }
        })
      }
    } else if (!user) {
      res.json({
        code: 404,
        data: '用户不存在'
      })
    }
  } catch (error) {
    res.json({
      code: 404,
      data: '登录失败',
      error
    })
  }
}
// 登出逻辑controller
exports.logout = (req, res) => {
  res.clearCookie('token')
  res.json({
    code: 200,
    data: {}
  })
}
// 获取用户controller
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).exec()
    res.json({
      code: 200,
      data: users
    })
  } catch (error) {
    res.json({
      code: 200,
      data: '获取用户列表失败',
      error
    })
  }
}
// 获取用户信息
exports.getUserInfo = async (req, res, next) => {
  const state = {
    1: req.params.id || '',
    2: res.locals.user ? res.locals.user.userId : ''
  }
  const userId = state[1] || state[2]

  try {
    const user = await User.findOne({
      _id: userId
    })
      .select('-createdAt -updatedAt')
      .exec()
    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    res.json({
      code: 404,
      data: '信息获取失败',
      error
    })
  }
}
// 更改用户信息
exports.patchUserInfo = async (req, res, next) => {
  const { body } = req
  const { userId } = res.locals.user
  try {
    const bodyData = await User.findOneAndUpdate(
      {
        _id: userId
      },
      body
    ).exec()
    res.json({
      code: 200,
      data: bodyData
    })
  } catch (error) {
    res.json({
      code: 400,
      data: '信息修改失败',
      error
    })
  }
}
// 用户密码修改
exports.patchPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const { userId } = res.locals.user
  const realOldPassword = md5(oldPassword)
  try {
    const user = await User.findOne({
      _id: userId
    }).exec()
    if (user && user.password !== realOldPassword) {
      res.json({
        code: 400,
        data: '原始密码错误'
      })
    }
    await User.findOneAndUpdate(
      {
        _id: userId
      },
      {
        password: newPassword
      }
    ).exec()
    res.clearCookie('token')
    res.json({
      code: 200,
      data: {}
    })
  } catch (error) {
    res.json({
      code: 404,
      data: '密码修改失败',
      error
    })
  }
}
