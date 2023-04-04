const { Router } = require('express')
const { session } = require('passport')
const router = Router()
const passport = require('passport')
const controller = require('../controller/users')
const loader = require('../middleware/upload')


router.get('/personal', passport.authenticate('jwt', {session: false}), controller.getPersonal)
router.post('/', passport.authenticate('jwt', {session: false}),controller.addBook)
router.post('/delete', passport.authenticate('jwt', {session: false}),controller.deleteBook)

router.post('/avatar',  loader.single('avatar'), passport.authenticate('jwt', {session: false}),controller.setAvatar)
router.patch('/update', passport.authenticate('jwt', {session: false}),controller.updateInfoUser)

router.get('/books/:bookId', passport.authenticate('jwt', {session: false}), controller.checkBook)

router.post('/booksLike', passport.authenticate('jwt', {session: false}),controller.addLikeBook)
router.post('/booksLike/delete', passport.authenticate('jwt', {session: false}),controller.deleteLikeBook)

router.get('/booksLike/:bookId', passport.authenticate('jwt', {session: false}), controller.checkLikeBook)
router.get('/booksCheck/:bookId', passport.authenticate('jwt', {session: false}), controller.checkLikesBook)

module.exports = router