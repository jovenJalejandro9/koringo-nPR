const util = require('../lib/utils')
const State = require('../model/state')
const example = require('../lib/examples')

const filterStates = ['family_inCharge', 'family_information', 'education_center',
  'medical_therapies', 'medical_diagnose', 'medical_mobility', 'medical_wheel_chair', 'medical_comunication',
  'medical_tests', 'medical_treatment', 'home_own_rent', 'home_material', 'economic_familiar_income', 'economic_external_support']
const attrsSheet = ['name', 'first_surname', 'zone', 'address', 'second_surname', 'birthday', 'id_number', 'photos_family',
  'photos_house', 'family_inCharge', 'family_information', 'education_center', 'social_situation', 'medical_therapies',
  'medical_diagnose', 'medical_mobility', 'medical_wheel_chair', 'medical_comunication', 'medical_tests', 'medical_treatment', 'medical_relative_disease',
  'home_own_rent', 'home_material', 'home_facilities', 'home_num_rooms', 'home_numBeds', 'home_forniture', 'home_salubrity',
  'economic_familiar_income', 'economic_external_support', 'economic_feeding_center', 'economic_others',
  'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete']
let collection = [example.sheet1, example.sheet2]
let idSheet = collection.length

module.exports = {
  create: (body) => {
    if (!util.checkFields(attrsSheet.slice(0, 4), body)) {
      return Promise.reject('noInfoCreateSheet')
    }
    const foundUser = collection.find((user) => {
      return user.name === body.name && user.first_surname === body.first_surname
    })
    if (foundUser !== undefined) return Promise.reject('userExist')
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
  getAll: (filters) => {
    return State.__getCollection__()
      .then((everyState) => {
        const promiseEveryState = [];
        for (let i = 0; i < collection.length; i++) {
          promiseEveryState.push(util.getEveryStateSheet(collection[i], everyState, "sheet"));
        }
        return Promise.all(promiseEveryState)
          .then((collSheetsEveryStates) => {
            return util.getStatesSheet(collSheetsEveryStates)
              .then((everySheet) => {
                if (Object.keys(filters).length > 0) {
                  const keysFilter = Object.keys(filters)
                  const newSheetColl = everySheet.filter((sheet) => {
                    for (let i = 0; i < keysFilter.length; i++) {
                      const filterValues = JSON.parse(filters[keysFilter[i]])
                      if (filterStates.includes(keysFilter[i])) {
                        if (util.findOneState(sheet[keysFilter[i]], filterValues)) {
                          return sheet
                        }
                      } else {
                        if (util.findOne(sheet[keysFilter[i]], filterValues)) {
                          return sheet
                        }
                      }
                    }
                    return null
                  })
                  return Promise.resolve(newSheetColl)
                }
                return Promise.resolve(everySheet)
              })
          })
      })
  },
  get: (id) => {
    const sheet = collection.find((ele) => {
      return ele.id === id
    })
    return State.__getCollection__()
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
    console.log(id)
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