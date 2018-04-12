const util = require('../lib/utils')
const User = require('../model/user')
const Sheet = require('../model/sheet')
const attrsVisit = ['sheetId', 'user_id', 'date', 'state']
let collection = [{
  "id": 1,
  "sheetId": 1,
  "timestamp": "2018-04-10T09:22:00.214Z",
  "state": "pending",
  "user_id": null,
  "date": null
}, {
  "id": 2,
  "sheetId": 2,
  "timestamp": "2018-04-10T09:22:00.214Z",
  "state": "pending",
  "user_id": null,
  "date": null
}]
let idVisit = collection.length
module.exports = {
  create: (body) => {
    if (!util.checkFields(attrsVisit.slice(0, -3), body)) {
      return Promise.reject('noInfoCreateVisit')
    }
    return Sheet
      .__getCollection__()
      .then((sheets) => {
        const foundSheet = sheets.find((sheet) => {
          return sheet.id === body.sheetId
        })
        if (foundSheet === undefined) return Promise.reject('noSheet')
        const foundVisitPending = collection.find((visit) => {
          return visit.sheetId === body.sheetId && visit.state === 'pending'
        })
        if (foundVisitPending !== undefined) return Promise.reject('existentVisit')
        const visit = Object.assign({}, body)
        idVisit++
        visit.id = idVisit
        visit.timestamp = util.getDate()
        visit.state = "pending"
        collection.push(util.nullComplete(visit, attrsVisit))
        return Promise.resolve(collection)
      })
  },
  getAll: (filters) => {
    if (Object.keys(filters).length > 0) {
      return Sheet
        .__getCollection__()
        .then(sheets => {
          const idSheets = []
          const keysFilter = Object.keys(filters)
          sheets.filter((sheet) => {
            for (let i = 0; i < keysFilter.length; i++) {
              const filterValues = JSON.parse(filters[keysFilter[i]])
              if (util.findOne(sheet[keysFilter[i]], filterValues)) {
                idSheets.push(sheet.id)
                return sheet
              }
            }
            return null
          })
          const newVisitCollection = collection.filter(visit => {
            return idSheets.includes(visit.sheetId)
          })
          return Promise.resolve(newVisitCollection)
        })

    }
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
    if (body.hasOwnProperty('sate' && body.state !== ('pending' || 'done'))) delete body.state
    return User
      .__getCollection__()
      .then((users) => {
        if (body.hasOwnProperty('user_id')) {
          const foundUser = users.find((user) => {
            return user.id === body.user_id
          })
          if (foundUser === undefined) return Promise.reject('noUser')
        }
        return Sheet
          .__getCollection__()
          .then((sheets) => {
            if (body.hasOwnProperty('sheetId')) {
              const foundSheet = sheets.find((sheet) => {
                return sheet.id === body.sheetId
              })
              if (foundSheet === undefined) return Promise.reject('noSheet')
            }
            const foundVisitPending = collection.find((visit) => {
              return visit.sheetId === body.sheetId && visit.state === 'pending'
            })
            if (foundVisitPending !== undefined) return Promise.reject('existentVisit')
            return util
              .findByAttr(collection, 'id', id)
              .then(ele => util.merge(ele, body))
              .then(newEle => util.replace(collection, id, newEle))
              .then((newcollection) => {
                collection = newcollection
                return newcollection
              })
          })
      })
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
  __emptyCollection__: () => {
    collection = []
    return Promise.resolve(collection)
  },
  __getVisits__: () => {
    return Promise.resolve(collection)
  }
}