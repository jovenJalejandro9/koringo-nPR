const Visit = require('../model/visit')

/** create function to create Visit. */
exports.create = (req, res) => {
  Visit
    .create(req.body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get every visits */
exports.getAll =(req, res) => {
  Visit
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** get function to get Visit by id. */
exports.get = (req, res) => {
  Visit
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** updateVisit function to get Visit by id. */
exports.update = (req, res) => {
  Visit
    .updateById(parseInt(req.params.id, 10), req.body)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

/** removeVisit function to get Visit by id. */
exports.delete = (req, res) => {
  Visit
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}
