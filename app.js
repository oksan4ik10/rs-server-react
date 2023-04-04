const express = require('express')
const bodyParser = require('body-parser')
const booksRoute = require('./routes/books')
const authRoute = require('./routes/auth')
const gradeRoute = require('./routes/grades')
const userRoute = require('./routes/users')
const reviewRoute = require('./routes/reviews')

const passport = require('passport')
const app = express()

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/api/books',booksRoute)
app.use('/api',authRoute)
app.use('/api/grades', gradeRoute)
app.use('/api/users', userRoute)
app.use('/api/reviews', reviewRoute)

module.exports = app;