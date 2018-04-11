const filterStates = ['medical_diagnose']
// const filterStates = ['inCharge', 'center', 'therapies', 'medical_information',
//   'family_information', 'home_info', 'familiar_income', 'external_support', 'feeding_center', 'other_helps',
//   'general_information', 'manifested_information', 'detected_information', 'warning_information', 'complete', 'sponsored']
function nextStates(state, newCollection, collection) {
  newCollection.push(state)
  const next = collection.find((ele) => {
    return ele.prev_state_id === state.id
  })
  if (next === undefined) {
    return [state]
  }
  return newCollection.concat(nextStates(next, [], collection))
}
module.exports = {
  replace: (collection, id, element) => {
    const newCollection = collection.map((ele) => {
      if (ele.id === id) {
        return element
      }
      return ele
    })
    return Promise.resolve(newCollection)
  },
  merge: (ele, body) => {
    return Promise.resolve(Object.assign({}, ele, body))
  },
  findByAttr: (collection, attr, value) => {
    const foundEle = collection.find((ele) => ele[attr] === value)
    if (foundEle !== undefined) {
      return Promise.resolve(foundEle)
    }
    return Promise.reject('noIdAttr')
  },
  merge: (ele, body) => {
    return Promise.resolve(Object.assign({}, ele, body))
  },
  getDate: () => new Date(),
  pick: (obj, attrList) => {
    const res = {}
    attrList.forEach((attr) => {
      if (obj.hasOwnProperty(attr)) {
        res[attr] = obj[attr]
      }
    })
    return res
  },
  checkFields: (attrs, data) => {
    for (let i = attrs.length - 1; i >= 0; i--) {
      if (!data.hasOwnProperty(attrs[i])) {
        return false
      }
    }
    return true
  },
  nullComplete: (obj, attrList) => {
    attrList.forEach((attr) => {
      if (!obj.hasOwnProperty(attr)) {
        obj[attr] = null
      }
    })
    return obj
  },
  findOne: (prop, filter) => {
    console.log(prop)
    console.log(filter)
    if (typeof prop === 'boolean') {
      if (prop === filter) {
        return true
      } else {
        return false
      }
    }
    findOneState: (field_name, prop, filter)
     console.log(field_name)
     return true
  },
  getStatesSheet: (collection) => {
    let newColl = collection.slice()
    let sizeColl = collection.length
    for (let i = 0; i < sizeColl; i++) {
      if (newColl[i].hasOwnProperty('states')) {
        for (let j = 0; j < newColl[i].states.length; j++) {
          if (newColl[i].states[j].prev_state_id === null) {
            newColl[i][newColl[i].states[j].field_name] = nextStates(newColl[i].states[j], [], newColl[i].states)
          }
        }
        delete newColl[i].states
      }
    }
    return Promise.resolve(newColl)
  },
  getEveryStateSheet: (sheet, statesCollection, remote_collection) => {
    const firstStates = statesCollection.filter((state) => {
      return (sheet.id === state.remote_id && remote_collection === state.remote_collection)
    })
    sheet.states = firstStates
    return Promise.resolve(sheet)
  },
  checkPrevState: (collection, stateData) => {
    for (state of collection) {
      if (state.prev_state_id === stateData.prev_state_id && stateData.prev_state_id !== null) return Promise.reject('prevIdexist')
      if (state.prev_state_id === stateData.prev_state_id && stateData.prev_state_id === null && state.remote_id === stateData.remote_id
        && state.remote_collection === stateData.remote_collection && state.field_name === stateData.field_name) return Promise.reject('existentFieldName')
    }
    const prevState = collection.find((state) => {
      return state.id === stateData.prev_state_id
    })
    if (prevState !== undefined || stateData.prev_state_id === null) {
      return Promise.resolve(true)
    }
    return Promise.reject('notExistantPrevId')
  },

}
