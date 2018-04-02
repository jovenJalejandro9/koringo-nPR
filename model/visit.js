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
  create: (initialBody) => {
    let body = util.pick(initialBody, attrsVisit)
    const visit = Object.assign({}, body)
    console.log("holaaa")
    // Creating the new visit
    idVisit ++
    visit.id = idVisit
    visit.timestamp = util.getDate()
    visit.state = "pending"
    collection.push(util.nullComplete(visit, attrsVisit))
    return Promise.resolve(collection)
  },
  getAll: () => {
    if (collection.length <= 0) {
      return Promise.reject(error.noVisits())
    }
    return Promise.resolve(collection)
  },
  get: (id) => {
    const visit = collection.find((ele) => {
      return ele.id === id
    })
    if (visit) {
      return Promise.resolve(visit)
    }
    return Promise.reject(error.noVisitId())
  },
  updateById: (id, body) => {
    const auxCollection = util.replace(collection, parseInt(id, 10), body)
      .then((newcollection) => collection = newcollection)
    return auxCollection
  },
  removeById: (id) => {
    let idFound = false
    collection = collection.filter((ele) => {
      if (ele.id === id) {
        idFound = true
      }
      return ele.id !== id
    })
    if (idFound) {
      return Promise.resolve(collection)
    }
    return Promise.reject(error.noVisitId())
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