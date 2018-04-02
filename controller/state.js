const State = require('../model/state')

/** create function to create State. */
exports.create = (req, res) => {
  State
    .create(req.body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get every sheets */
exports.getAll = (req, res) => {
  State
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get State by id. */
exports.get = (req, res) => {
  State
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}
