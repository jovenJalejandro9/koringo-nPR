const util = require('../lib/utils')
const User = require('../model/user')
const example = require('../lib/examples')

const attrsState = ['prev_state_id', 'value', 'user_id', 'remote_id', 'remote_collection', 'field_name']
const remoteCollection = ['sheet']
const fieldNames = ['photos_family',
  'photos_house', 'family_inCharge', 'family_information', 'education_center', 'social_situation', 'medical_therapies',
  'medical_diagnose', 'medical_mobility', 'medical_wheel_chair', 'medical_comunication', 'medical_tests', 'medical_treatment', 'medical_relative_disease',
  'home_own_rent', 'home_material', 'home_facilities', 'home_num_rooms', 'home_numBeds', 'home_forniture', 'home_salubrity',
  'economic_familiar_income', 'economic_external_support', 'economic_feeding_center', 'economic_others',
  'general_information', 'manifested_information', 'detected_information', 'warning_information']
let collection = [example.state1, example.state2, example.state3]
let idState = collection.length

module.exports = {
  create: (body) => {
    if (!util.checkFields(attrsState.slice(1), body)) {
      return Promise.reject('noInfoCreateState')
    }
    if (!remoteCollection.includes(body.remote_collection)) return Promise.reject('noRemoteCollection')
    if (!fieldNames.includes(body.field_name)) return Promise.reject('noFieldName')

    const firsState = collection.find(state => (state.remote_id === body.remote_id && state.remote_collection === body.remote_collection &&
      state.field_name === body.field_name && state.prev_state_id === null))

    if (firsState !== undefined) {
      // If there are prevoious state we assign the last one id to previous_id
      const prevStates = util.nextStates(firsState, [], collection)
      body.prev_state_id = prevStates[prevStates.length - 1].id
    } else {
      // If ther is not previous state we assign null to prev_state_id
      body.prev_state_id = null
    }
    return User
      .__getCollection__()
      .then((users) => {
        const foundUser = users.find(user => user.id === body.user_id)
        if (foundUser === undefined) return Promise.reject('noUser')
        const state = Object.assign({}, body)
        state.id = ++idState
        state.timestamp = util.getDate()
        collection.push(state)
        return Promise.resolve(collection)
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
  }
}
