const error = require('../lib/error')
const util = require('../lib/utils')
const attrsState = ['prev_state_id', 'value', 'user_id', 'sheet_id']
const state1 = {
  id: 1,
  prev_state_id: null,
  value: {
    diagnose: 'Autism',
    start_year: 1993
  },
  user_id: 3,
  remote_id: 1, 
  remote_collection: 'sheet',
  field_name: 'medical_history'
}
const state2 = {
  id: 2,
  prev_state_id: 1,
  value: {
    diagnose: 'Dowmn Sindrome',
    start_year: 1996
  },
  user_id: 3,
  remote_id: 1, 
  remote_collection: 'sheet',
  field_name: 'medical_history'
}
const state3 = {
  id: 3,
  prev_state_id: 2,
  value: {
    diagnose: 'Dowmn Sindrome',
    start_year: 1996
  },
  user_id: 3,
  remote_id: 1, 
  remote_collection: 'sheet',
  field_name: 'medical_history'
}
const state4 = {
  id: 6,
  prev_state_id: null,
  value: {
    sport: 'football',
    start_year: 1996
  },
  user_id: 3,
  remote_id: 3, 
  remote_collection: 'sheet',
  field_name: 'free_time'
}

let collection = [state1, state2, state3, state4]
let idState = collection.length

module.exports = {
  create: (body) => {
    const state = Object.assign({}, body)
    state.id = ++idState
    state.timestamp = util.getDate()
    collection.push(state)
    return Promise.resolve(collection)
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
  __checkPrevState__: (stateData) => {
    for(state of collection){
      if(state.prev_state_id === stateData.prev_state_id && stateData.prev_state_id !== null) return Promise.reject('prevIdexist')
      if(state.prev_state_id === stateData.prev_state_id && stateData.prev_state_id === null && state.remote_id === stateData.remote_id
        && state.remote_collection === stateData.remote_collection && state.field_name === stateData.field_name ) return Promise.reject('existentFieldName')
    }

    const prevState = collection.find((state) => {
      return state.id === stateData.prev_state_id
    })
    if(prevState !== undefined || stateData.prev_state_id === null) {
      return Promise.resolve(true)
    }
    return Promise.reject('notExistantPrevId')
  }, 
  __emptyCollection__: () => {
    collection = []
    return Promise.resolve(collection)
  },
}