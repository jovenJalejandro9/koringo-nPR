const util = require('../lib/utils')
const error = require('../lib/error')
const attrsVisit = ['sheetId', 'user_id', 'date']
let collection = [{
      "sheetId": 1,
      "user_id": 1,
      "date": "Wed Feb 28",
}]
let idVisit = collection.length

module.exports = {
  create: (body) => {
    const visit = Object.assign({}, body)
    idVisit ++
    visit.id = idVisit
    visit.timestamp = util.getDate()
    visit.state = "pending"
    collection.push(util.nullComplete(visit, attrsVisit))
    return Promise.resolve(collection)
  },
  getAll: () => {
    return Promise.resolve(collection)
  },
  get: (id) => {
    const visit = collection.find((ele) => {
      return ele.id === id
    })
    if (visit === undefined) return Promise.resolve({})
    return Promise.resolve(visit)
  },
  updateById: (id, body) => {
    const auxCollection = util.replace(collection, parseInt(id, 10), body)
      .then((newcollection) => collection = newcollection)
    return auxCollection
  },
  removeById: (id) => {
    collection = collection.filter((ele) => {
      return ele.id !== id
    })
    return Promise.resolve(collection)
  },
  findByAttr: (attr, value) => {
    return util.findByAttr(collection, attr, value)
  },
  emptyVisits: () => {
    collection = []
    return Promise.resolve(collection)
  },
  getVisits: () => {
    return Promise.resolve(collection)
  }
}