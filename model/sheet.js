const util = require('../lib/utils')
const error = require('../lib/error')
const state = require('../model/state')
const attrsSheet = ['name', 'first_surname', 'second_surname', 'birthday', 'id_number', 'zone', 'address', 'family_photos', 'house_photos', 'inCharge',
  'center', 'therapies', 'social_situation', 'medical_information', 'family_information', 'home_info', 'economic_information',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete']
let collection = [{
      "id": 1,
      "name": "Jose",
      "first_surname": "Perez",
      "address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
      "zone": "Chiclayo", 
      "home_info":1, 
      "inCharge": null 
}]
let idSheet = collection.length

module.exports = {
  create: (initialBody) => {
    let body = util.pick(initialBody, attrsSheet)
    if (body.hasOwnProperty('name') && body.hasOwnProperty('first_surname')
      && body.hasOwnProperty('address') && body.hasOwnProperty('zone')) {
      const sheet = Object.assign({}, body)
      // Creating the new sheet
      idSheet ++
      sheet.id = idSheet
      sheet.complete = false 
      sheet.timestamp = util.getDate()
      collection.push(util.nullComplete(sheet, attrsSheet))
      let statesCollection = Object.assign({}, collection)
      return Promise.resolve(statesCollection)
    }
    return Promise.reject(error.noInfoCreateSheet())
  },
  getAll: () => {
    if (collection.length <= 0) {
      return Promise.reject(error.noSheets())
    }
    return state.
      getCollection()
      .then((stateCollection) => {
        return util
          .getStateCollection(collection, stateCollection)
          .then((collectionStates) => Promise.resolve(collectionStates))
      })  
      .catch((error) => Promise.reject(error.noSheets()))
  },
  get: (id) => {
    const sheet = collection.find((ele) => {
      return ele.id === id
    })
    if (sheet) {
      return Promise.resolve(sheet)
    }
    return Promise.reject(error.noSheetId())
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
    return Promise.reject(error.noSheetId())
  },
  findByAttr: (attr, value) => {
    return util.findByAttr(collection, attr, value)
  },
  emptySheets: () => {
    collection = []
    return Promise.resolve(collection)
  },
  getSheets: () => {
    return Promise.resolve(collection)
  }
}