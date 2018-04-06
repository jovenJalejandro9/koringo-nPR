
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

module.exports = {
  replace: (collection, id, element) => {
    let found = false
    const newCollection = collection.map((ele) => {
      if (ele.id === id) {
        found = true
        return Object.assign({}, ele, element)
      }
      return ele
    })
    if (found) {
      return Promise.resolve(newCollection)
    }
    return Promise.reject('noIdFound')
  },
  findByAttr: (collection, attr, value) => {
    const foundEle = collection.find((ele) => ele[attr] === value)
    if (foundEle !== undefined) {
      return Promise.resolve(foundEle)
    }
    return Promise.reject('noIdAttr')
  },
  getDate: () =>  new Date(),
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
  findOne: (bigArray, smallArray) => {
    return smallArray.some((v) => {
      return bigArray.indexOf(v) >= 0
    })
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
