const { Router } = require('express')
const { session } = require('passport')
const router = Router()
const passport = require('passport')
const controller = require('../controller/reviews')

router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.delete('/:reviewId', passport.authenticate('jwt', {session: false}), controller.delete)
router.get('/user/:bookId', passport.authenticate('jwt', {session: false}),controller.getReviewUser)
router.get('/book/:bookId',controller.getBookReviews)
router.get('/last',controller.geReviewsLast)
router.get('/check/:bookId', passport.authenticate('jwt', {session: false}),controller.checkReviewUser)

module.exports = router