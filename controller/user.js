

const User = require('../model/user')

/** create function to create User. */
exports.create = (req, res) => {
  User
    .create(req.body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get every users */
exports.getAll = (req, res) => {
  User
    .getAll(req.query)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get User by id. */
exports.get = (req, res) => {
  User
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** updateUser function to get User by id. */
exports.update = (req, res) => {
  User
    .updateById(parseInt(req.params.id, 10), req.body)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** removeUser function to get User by id. */
exports.delete = (req, res) => {
  User
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}

/** removeUser function to get User by id. */
exports.findByAttr = (attr, value) => {
  User
    .findByAttr(attr, value)
    .then((result) => () => result)
    .catch((err) => () => err)
}
/** find User by Attribute. */
exports.find = (attr, value) => {
  const user = User.find(attr, value)
  return user
}

