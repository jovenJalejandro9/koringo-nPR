const error = require('../lib/error')

// const stateFields = ['family_photos', 'house_photos', 'inCharge',
//   'family_information', 'center', 'therapies', 'social_situation', 'medical_information', 'home_info', 'economic_information',
//   'general_information', 'manifested_information','detected_information', 'warning_information']
const stateFields = ['home_info','inCharge']

function nextStates(state, newCollection, collection) {
  console.log("dentro de nextSates! ")
  newCollection.push(state)
  const next = collection.find((ele) => {
    return ele.prev_state_id === state.id  
  })
  if (next === undefined){
    return [state]
  }
  return newCollection.concat(nextStates(next, [], collection))
}
function getPrevStates(state, newCollection, collection) {
  if (state.prev_state_id === null) {
    return [state]
  }
  newCollection.push(state)
  const prevState = collection.find(function toEle(ele) {
    return ele.id === state.prev_state_id
  })
  return newCollection.concat(getPrevStates(prevState, [], collection))
}

module.exports = {
  replace: (collection, id, element) => {
    let idFound = false
    const newCollection = collection.map((ele) => {
      if (ele.id === id) {
        idFound = true
        return Object.assign({}, ele, element)
      }
      return ele
    })
    if (idFound === true) {
      return Promise.resolve(newCollection)
    }
    return Promise.reject(error.noIdFound())
  },
  findByAttr: (collection, attr, value) => {
    const newColl = collection.find((ele) => {
      return ele[attr] === value
    })
    if (newColl !== undefined) {
      return Promise.resolve(newColl)
    }
    return Promise.reject(error.noIdAttr())
  },
  getDate: () => {
    const date = new Date()
    return date
  },
  hashCode: (str) => {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  },
  pick: (obj, attrList) => {
    const res = {}
    attrList.forEach((attr) => {
      if (obj.hasOwnProperty(attr)) {
        res[attr] = obj[attr]
      }
    })
    return res
  }, 
  nullComplete: (obj,attrList) => {
    attrList.forEach((attr) => {
      if(!obj.hasOwnProperty(attr)) {
        obj[attr] = "null"
      }
    })
    return obj
  },
  listStatesLast: (state, newCollection, collection) => {
    return getPrevStates(state, newCollection, collection)
  }, 
  listStatesFirst: (idState, newCollection, collection) => {
    for (let i = 0 ; i < collection.length ; i++) {
      if(collection[i] === idState)
        return nextStates(collection[id], newCollection, collection)
    } 
  },
  getStatesSheet: (collection) => {
    let newColl = collection.slice()
    let sizeColl = collection.length
    for (let i = 0 ; i < sizeColl ; i++) {
      if(newColl[i].hasOwnProperty('states')){
        for(let j = 0; j < newColl[i].states.length ; j++){
          if(newColl[i].states[j].prev_state_id === null){
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
  }

}
