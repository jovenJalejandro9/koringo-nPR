const Visit = require('../model/visit')
const util = require('../lib/utils')
const User = require('../model/user')
const Sheet = require('../model/sheet')
const error = require('../lib/error')

const attrsVisit = ['sheetId', 'user_id', 'date', 'state']

exports.create = (req, res) => {
  const visitData = util.pick(req.body, attrsVisit.slice(0, -1))
  if (!util.checkFields(attrsVisit.slice(0, -2), visitData)) {
    return res.status(400).send(error['noInfoCreateVisit']())
  }
  User
    .__getCollection__()
    .then((users) => {
      const foundUser = users.find((user) => {
        return user.id === visitData.user_id
      })
      if(foundUser === undefined) return res.status(400).send(error['noUser']())
      Sheet
        .__getCollection__()
        .then((sheets) => {
          const foundSheet = sheets.find((sheet) => {
            return sheet.id === visitData.sheetId
          })
          if(foundSheet === undefined) return res.status(400).send(error['noSheet']())
          Visit
          .create(visitData)
          .then((result) => res.status(201).json(result))
          .catch((err) => res.status(400).send(err))
        })
    })
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
