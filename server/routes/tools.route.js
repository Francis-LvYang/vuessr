const router = require('express').Router()
const check = require('../middlewares/check.middleware')
const system = require('../controllers/tools/system.controller')
const upload = require('../controllers/tools/upload.controller')
const github = require('../controllers/tools/github.controller')
const backup = require('../controllers/tools/backup.controller')

router.get('/system', check.auth('token'), system.system)
