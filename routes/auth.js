const { Router } = require('express')
const router = Router()
const controller = require('../controller/auth')

router.post('/login', controller.login)
router.post('/auth', controller.auth)

router.put('/forget-password', controller.forget)
router.put('/reset-password', controller.reset)

module.exports = router