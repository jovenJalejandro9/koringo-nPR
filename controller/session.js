const jwt = require('jsonwebtoken')
const error = require('../lib/error')
const config = require('../config/config')
const User = require('../model/user')

const crypto = require('crypto')

/** create function to create Session. */
exports.createToken = (req, res) => {
  const password = crypto.createHash('md5').update(req.body.password).digest('hex')

  User
    .authenticate(req.body.name, password)
    .then((user) => {
  	res.json({token: jwt.sign({id: user.id}, config.secretKey)})
    })
    .catch((err) => res.status(401).send(error[err]()))
}
