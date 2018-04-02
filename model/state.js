const util = require('../lib/utils')
const error = require('../lib/error')
const attrsState = ['prev_state_id', 'value', 'user_id', 'sheet_id']
const state1 = {
  id: 1,
  prev_state_id: null,
  value: {
    diagnose: 'Autism',
    start_year: 1993
  },
  user_id: 3,
  sheet_id: 2
}
const state2 = {
  id: 2,
  prev_state_id: 1,
  value: {
    diagnose: 'Dowmn Sindrome',
    start_year: 1996
  },
  user_id: 3,
  sheet_id: 2
}
const state3 = {
  id: 3,
  prev_state_id: 2,
  value: {
    diagnose: 'Dowmn Sindrome',
    start_year: 1996
  },
  user_id: 3,
  sheet_id: 2
}
const state4 = {
  id: 6,
  prev_state_id: 5,
  value: {
    sport: 'football',
    start_year: 1996
  },
  user_id: 3,
  sheet_id: 2
}

let collection = [state1, state2, state3,state4]
let idState = collection.length

module.exports = {
  create: (initialBody) => {
    const body = util.pick(initialBody, attrsState)
    // We check the compulsory fields
    if (body.hasOwnProperty('value') && body.hasOwnProperty('prev_state_id')
      && body.hasOwnProperty('user_id') && body.hasOwnProperty('sheet_id')) {
      const prevIdState = collection.find((ele) => {
        return ele.id === body.prev_state_id
      })
      // We check if the previous state extists
      if ((prevIdState === undefined) && (body.prev_state_id !== null)) {
        return Promise.reject(error.noPrevState())
      }
      const state = Object.assign({}, body)
      idState ++
      state.id = idState
      state.timestamp = util.getDate()
      collection.push(state)
      // We return a list of the link states
      const listStates = util.listStatesLast(collection[collection.length - 1], [], collection)
      return Promise.resolve(listStates)
    }
    return Promise.reject(error.noInfoCreateState())
  },
  getAll: () => {
    if (collection.length <= 0) {
      return Promise.reject(error.noStates())
    }
    return Promise.resolve(collection)
  },
  get: (id) => {
    const state = collection.find((ele) => {
      return ele.id === id
    })
    if (state === undefined) {
      return Promise.reject(error.noState())
    }
    return Promise.resolve(state)
  },
  findByAttr: (attr, value) => {
    return util.findByAttr(collection, attr, value)
  }, 
  getCollection: () => {
    return Promise.resolve(collection)
  }
}
