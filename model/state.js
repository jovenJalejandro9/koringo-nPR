const error = require('../lib/error')
const util = require('../lib/utils')
const attrsState = ['prev_state_id', 'value', 'user_id', 'remote_id', 'remote_collection', 'field_name']
const User = require('../model/user')

const remote_collections = ['sheet']
const field_names = ['family_photos', 'house_photos', 'inCharge', 'center', 'therapies', 'social_situation', 'medical_information',
'family_information', 'home_info', 'familiar_income','external_support', 'feeding_center', 'other_helps',
'general_information', 'manifested_information', 'detected_information', 'warning_information']
const state1 = {
  id: 1,
  prev_state_id: null,
  value: {
    name: 'Autism',
    start_year: 1993
  },
  user_id: 3,
  remote_id: 1,
  remote_collection: 'sheet',
  field_name: 'medical_diagnose'
}
const state2 = {
  id: 2,
  prev_state_id: 1,
  value: {
    name: 'Dowmn Sindrome',
    start_year: 1996
  },
  user_id: 3,
  remote_id: 1,
  remote_collection: 'sheet',
  field_name: 'medical_diagnose'
}
const state4 = {
  id: 6,
  prev_state_id: null,
  value: {
    name: 'football',
    start_year: 1996
  },
  user_id: 3,
  remote_id: 3,
  remote_collection: 'sheet',
  field_name: 'sociale_situation'
}

let collection = [state1, state2, state4]
let idState = collection.length

module.exports = {
  create: (body) => {
    if (!util.checkFields(attrsState, body)) {
      return Promise.reject('noInfoCreateState')
    }
    if(!remote_collections.includes(body.remote_collection)) return Promise.reject('noRemoteCollection')
    if(!field_names.includes(body.field_name)) return Promise.reject('noFieldName')
    return util
      .checkPrevState(collection, body)
      .then(() => {
        return User
          .__getCollection__()
          .then((users) => {
            const foundUser = users.find((user) => {
              return user.id === body.user_id
            })
            if (foundUser === undefined) return Promise.reject('noUser')
            const state = Object.assign({}, body)
            state.id = ++idState
            state.timestamp = util.getDate()
            collection.push(state)
            return Promise.resolve(collection)
          })
      })
  },
  getAll: () => {
    return Promise.resolve(collection)
  },
  get: (id) => {
    const state = collection.find((ele) => {
      return ele.id === id
    })
    if (state === undefined) return Promise.resolve({})
    return Promise.resolve(state)
  },
  __getCollection__: () => {
    return Promise.resolve(collection)
  },
  __emptyCollection__: () => {
    collection = []
    return Promise.resolve(collection)
  },
}