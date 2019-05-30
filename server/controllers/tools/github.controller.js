const mongoose = require('mongoose')
const axios = require('@nuxtjs/axios')
const globalConfig = require('../../config/global.config')
const token = require('../../utils/token.util')

const User = mongoose.model('User')

let state = ''
exports.githubLogin = (req, res) => {
  state = req.params.state || ''
  const { domain } = globalConfig.app
  const u = `https://github.com/login/oauth/authorize?client_id=${
    globalConfig.github.id
  }&scope=${
    globalConfig.github.scope
  }&redirect_uri=${domain}/api/oauth/github/callback&state=${state}`
  res
    .status(302)
    .set('location', u)
    .end()
}

exports.githubCallback = async (req, res, next) => {
  const { query } = req
  const u = `https://github.com/login/oauth/access_token?client_id=${
    globalConfig.github.id
  }&client_secret=${globalConfig.github.secret}&code=${
    query.code
  }&state=${state}`
  let githubToken = ''
  const userInfo = {}

  await axios
    .get(u)
    .then(ret => {
      const { data } = ret
      const arr = data.split('&')
      const obj = {}
      arr.forEach(item => {
        const key = item.split('=')[0]
        const value = item.split('=')[1]
        obj[key] = value
      })
      if (obj.access_token) {
        githubToken = obj.access_token
      }
    })
    .catch(err => {
      console.log(err)
    })

  if (githubToken) {
    await axios
      .get(`https://api.github.com/user?access_token=${githubToken}`)
      .then(ret => {
        const { data } = ret
        userInfo.username = data.login
        userInfo.email = data.email
        userInfo.description = data.bio
        userInfo.avatar = data.avatar_url
      })
    let user = await User.findOne({
      username: userInfo.username
    }).exec()

    if (!user) {
      user = await new User(userInfo).save()
    }
    const t = token.sign(user)
    res.cookie('token', t, {
      maxAge: globalConfig.jwt.expiresIn,
      httpOnly: true
    })
  }
}
