const auth = require('../lib/auth')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const error = require('../lib/error')
const UserModel = require('../model/user')

module.exports = {
  isAuthenticated: (req, res, next) => {
    const token = auth(req)
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        res.status(401).send(error.noToken())
      } else {
        UserModel
          .findByAttr('id', decoded.id)
          .then((user) =>{
            const newUser = Object.assign({}, user)
            // The password should not show up in the request
            delete newUser.password
            req.headers.user = JSON.stringify(newUser)
            next()
          })
          .catch(() => res.status(401).send(error.noIdUser()))
      }
    })
  },
  hasPrivileges: (req, res, next) => {
    if (req.headers.user) {
      const user = JSON.parse(req.headers.user)
      if (user.role === 'root' || user.role === 'admin' ) {
        next()
      } else {
        res.status(401).send(error.noPrivileges())
      }
    } else {
      res.status(401).send(error.notAuthenticated())
    }
  }
}

