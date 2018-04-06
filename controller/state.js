const State = require('../model/state')
const util = require('../lib/utils')
const error = require('../lib/error')

const attrsState = ['prev_state_id', 'value', 'user_id', 'sheet_id']

exports.create = (req, res) => {
  const stateData = util.pick(req.body, attrsState)
  if (!util.checkFields(attrsState.slice(0, -1), stateData)) {
    return res.status(400).send(error['noInfoCreateState']())
  }
  State
    .__checkPrevState__(stateData.prev_state_id)
    .then((result) => {
      State
        .create(stateData)
        .then((result) => res.status(201).json(result))
        .catch((err) => res.status(400).send(err))
    },(err) => res.status(400).send(error[err]()))
}

exports.getAll = (req, res) => {
  State
    .getAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}

exports.get = (req, res) => {
  State
    .get(parseInt(req.params.id, 10))
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).send(err))
}