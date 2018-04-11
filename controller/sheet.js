const Sheet = require('../model/sheet')
const error = require('../lib/error')
const util = require('../lib/utils')

const attrParams = ['name','medical_diagnose']
// const attrParams = ['name', 'age', 'zone', 'center', 'therapies', 'diagnose', 'mobility', 'wheel_chair', 'comunication', 'tests', 'treatment']

const attrsSheet = ['name', 'first_surname', 'zone', 'address', 'second_surname', 'birthday', 'id_number', 'family_photos', 'house_photos', 'inCharge',
  'center', 'therapies', 'social_situation', 'medical_diagnose', 'medical_mobility', 'medical_wheel_chair', 'medical_comunication', 'medical_tests', 'medical_treatment',
  'medical_relative_disease', 'family_information',
  'home_own_rent', 'home_material', 'home_facilities', 'home_num_rooms', 'home_numBeds', 'home_forniture', 'home_salubrity',
  'economic_familiar_income', 'economic_external_support', 'economic_feeding_center', 'economic_others',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete']

exports.create = (req, res) => {
  console.log(attrsSheet.slice(0, 7))
  let sheetData = util.pick(req.body, attrsSheet.slice(0, 7))
  Sheet
    .create(sheetData)
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).send(error[err]()))
}

exports.getAll = (req, res) => {
  const params = util.pick(req.query, attrParams)
  Sheet
    .getAll(params)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(error[err]()))
}

exports.get = (req, res) => {
  Sheet
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(error[err]()))
}

exports.update = (req, res) => {
  let sheetData = util.pick(req.body, attrsSheet)
  Sheet
    .updateById(parseInt(req.params.id, 10), sheetData)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(error[err]()))
}

exports.delete = (req, res) => {
  Sheet
    .removeById(parseInt(req.params.id, 10))
    .then((result) => { res.status(200).json(result) })
    .catch((err) => res.status(400).send(error[err]()))
}
