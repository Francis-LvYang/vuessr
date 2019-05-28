const globalConfig = require('../config/global.config')

module.exports = (req, res, next) => {
  let cookieDomain = ''
  const isLoal = /127.0.0.1/.test(globalConfig.app.domain)
  if (isLoal) {
    cookieDomain = '127.0.0.1'
  } else {
    const arr = globalConfig.app.domain.split('.')
    cookieDomain = `${arr[arr.length - 2]}.${arr[arr.length - 1]}`
  }
  res.locals.user = {}
  res.locals.cookieDomain = cookieDomain
  next()
}
