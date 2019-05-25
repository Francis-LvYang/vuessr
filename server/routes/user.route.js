const router = require('express').Router()
const user = require('../controllers/user.controller')
const check = require('../middlewares/check.middleware')

router.get('/get-img-verify', user.getcode)
router.post(
  '/login',
  check.formData(['username', 'password', 'code']),
  user.login
)

module.exports = router
