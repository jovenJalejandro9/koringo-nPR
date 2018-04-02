const error = require('../lib/error')
const state = require('../model/state')

// const stateFields = ['family_photos', 'house_photos', 'inCharge',
//   'family_information', 'center', 'therapies', 'social_situation', 'medical_information', 'home_info', 'economic_information',
//   'general_information', 'manifested_information','detected_information', 'warning_information']
const stateFields = ['home_info','inCharge']

function nextStates(state, newCollection, collection) {
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
  getStateCollection: (sheetsCollection, statesCollection) => {
    newSheetColl = sheetsCollection.map((sheet) => {
      let auxSheet = Object.assign({}, sheet)
      for(let i = 0; i < stateFields.length; i++){
        if(sheet[stateFields[i]] !== null){
          console.log("field encontrado diferente de null")
          for (let j = 0 ; i < statesCollection.length ; i++) {
            if(statesCollection[j].id === sheet[stateFields[i]]){
              console.log("dentro del meollo final ! ")
              auxSheet[stateFields[i]] = listStatesFirst(sheet[stateFields[i]], [], statesCollection)
            }
          }          
        }
      }
      return auxSheet
    })
    return Promise.resolve(newSheetColl)
  }

}
