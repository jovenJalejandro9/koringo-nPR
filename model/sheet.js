const util = require('../lib/utils')
const State = require('../model/state')
const attrsSheet = ['name', 'first_surname', 'second_surname', 'birthday', 'id_number', 'zone', 'address', 'family_photos', 'house_photos', 'inCharge',
  'center', 'therapies', 'social_situation', 'medical_information', 'family_information', 'home_info', 'familiar_income','external_support', 'feeding_center', 'other_helps',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete','sponsored']
let collection = [
  {
    "id": 1,
    "name": "Jose",
    "first_surname": "Perez",
    "address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
    "zone": "Chiclayo", 
    "help": false 
  },
  {
    "id": 2,
    "name": "Amparo",
    "first_surname": "Ribola",
    "address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
    "zone": "Illimo", 
    "help": true 
  }
]
let idSheet = collection.length

module.exports = {
  create: (body) => {
    const sheet = Object.assign({}, body)
    idSheet++
    sheet.id = idSheet
    sheet.help = false 
    sheet.complete = false
    sheet.timestamp = util.getDate()
    collection.push(util.nullComplete(sheet, attrsSheet))
    return State.__getCollection__()
      .then((everyState) => {
        const promiseEveryState = [];
        for (let i = 0; i < collection.length; i++) {
          promiseEveryState.push(util.getEveryStateSheet(collection[i], everyState, "sheet"));
        }
        return Promise.all(promiseEveryState)
          .then((collSheetsEveryStates) => {
            return util.getStatesSheet(collSheetsEveryStates)
          })
      })
  },
  getAll: () => {
    return State.__getCollection__()
      .then((everyState) => {
        const promiseEveryState = [];
        for (let i = 0; i < collection.length; i++) {
          promiseEveryState.push(util.getEveryStateSheet(collection[i], everyState, "sheet"));
        }
        console.log(collection)
        return Promise.all(promiseEveryState)
          .then((collSheetsEveryStates) => {
            return util.getStatesSheet(collSheetsEveryStates)
          })
      })
  },
  get: (id) => {
    const sheet = collection.find((ele) => {
      return ele.id === id
    })
    return State.getCollection()
      .then((everyState) => {
        return util.getEveryStateSheet(sheet, everyState, "sheet")
          .then((promiseEveryState) => {
            const auxColl = []
            auxColl.push(promiseEveryState)
            return util.getStatesSheet(auxColl)
              .then((collGetAllSheet) => collGetAllSheet[0])
          })
      })
  },
  updateById: (id, body) => {
    return util.replace(collection, parseInt(id, 10), body)
      .then((newcollection) => collection = newcollection)
  },
  removeById: (id) => {
    console.log(collection)
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
  __getCollection__: () => {
    return Promise.resolve(collection)
  }
}