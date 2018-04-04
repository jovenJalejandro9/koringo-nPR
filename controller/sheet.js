const Sheet = require('../model/sheet')

const attrsSheet = ['name', 'first_surname', 'second_surname', 'birthday', 'id_number', 'zone', 'address', 'family_photos', 'house_photos', 'inCharge',
  'center', 'therapies', 'social_situation', 'medical_information', 'family_information', 'home_info', 'economic_information',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete']


exports.create = (req, res) => {
  let body = util.pick(req.body, attrsSheet)
  Sheet
    .create(req.body)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.getAll = (req, res) => {
  Sheet
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.get = (req, res) => {
  Sheet
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.update = (req, res) => {
  let body = util.pick(req.body, attrsSheet)  
  Sheet
    .updateById(parseInt(req.params.id, 10), body)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.delete = (req, res) => {
  Sheet
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}
