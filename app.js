const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()

// uncomment after placing your favicon in /public
app.use(router)
router.use(logger('dev'))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(cookieParser())

require('./routes/index')(router)

// catch 404 and forward to error handler
router.use(function use(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function use(err, req, res) {
    res.status(err.status || 500)
    res.json('error', {
      message: err.message,
      error: err
    })
  })
}

// no stacktraces leaked to user
router.use(function use(err, req, res) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  })
})

app.listen(3000)
module.exports = app
