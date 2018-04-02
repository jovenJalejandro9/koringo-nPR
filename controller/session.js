const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../model/user')

/** create function to create Session. */
exports.createToken = (req, res) => {
  User
    .authenticate(req.body.name, req.body.password)
    .then((user) => {
  	res.json({token: jwt.sign({id: user.id}, config.secretKey)})
    })
    .catch((err) => res.status(401).send(err))
}
