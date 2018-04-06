const Sheet = require('../model/sheet')
const error = require('../lib/error')
const util = require('../lib/utils')

const attrsSheet = ['name', 'first_surname', 'zone', 'address', 'second_surname', 'birthday', 'id_number', 'family_photos', 'house_photos', 'inCharge',
  'center', 'therapies', 'social_situation', 'medical_information', 'family_information', 'home_info', 'economic_information',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete']


exports.create = (req, res) => {
  let sheetData = util.pick(req.body, attrsSheet)
  if (!util.checkFields(attrsSheet.slice(0, 4), sheetData)) {
    return res.status(400).send(error['noInfoCreateSheet']())
  }
  Sheet
    .create(sheetData)
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
  let sheetData = util.pick(req.body, attrsSheet)  
  Sheet
    .updateById(parseInt(req.params.id, 10), sheetData)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.delete = (req, res) => {
  Sheet
    .removeById(parseInt(req.params.id, 10))
    .then((result) => {res.status(200).json(result)})
    .catch((err) => res.status(400).send(err))
}
