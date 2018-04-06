const Visit = require('../model/visit')
const util = require('../lib/utils')

const attrsVisit = ['sheetId', 'user_id', 'date', 'state']

exports.create = (req, res) => {
  const body = util.pick(req.body, attrsVisit.slice(0, -1))
  Visit
    .create(body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.getAll =(req, res) => {
  Visit
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.get = (req, res) => {
  Visit
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.update = (req, res) => {
  const visitData = util.pick(req.body, attrsVisit)
  Visit
    .updateById(parseInt(req.params.id, 10), visitData)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.delete = (req, res) => {
  Visit
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}
