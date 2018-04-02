const Sheet = require('../model/sheet')

/** create function to create Sheet. */
exports.create = (req, res) => {
  Sheet
    .create(req.body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get every sheets */
exports.getAll = (req, res) => {
  Sheet
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get Sheet by id. */
exports.get = (req, res) => {
  Sheet
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** updateSheet function to get Sheet by id. */
exports.update = (req, res) => {
  Sheet
    .updateById(parseInt(req.params.id, 10), req.body)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** removeSheet function to get Sheet by id. */
exports.delete = (req, res) => {
  Sheet
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}
