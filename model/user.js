const util = require('../lib/utils')

const attrsUser = ['name', 'first_surname', 'second_surname', 'nickname', 'password', 'email', 'birthday', 'studies', 'professions', 'prev_volunteering', 'role']
const user1 = {
  id: 1,
  name: 'root',
  password: '69016ee62c6fd731218a3743a585dbfc',
  role: 'root',
  professions: [],
  first_surname: null,
  second_surname: null,
  nickname: null,
  email: null,
  birthday: null,
  studies: [],
  prev_volunteering: []
}
let collection = [user1]
let idUser = collection.length

module.exports = {
  create: (body) => {

    if (body.hasOwnProperty('role') && !['normal','admin'].includes(body.role)) {
      console.log("gollk")
      return Promise.reject('incorrectRole')
    }
    if (!util.checkFields(attrsUser.slice(0, -1), body)) {
      console.log("dios!!")
      console.log(attrsUser.slice(0, -1))
      return Promise.reject('noInfoCreateUser')
    }
    const user = Object.assign({}, body)
    if (!user.hasOwnProperty('role')) {
      user.role = 'normal'
    }

    idUser++
    user.id = idUser
    user.timestamp = util.getDate()
    collection.push(util.nullComplete(user, attrsUser))
    return Promise.resolve(collection)
  },
  getAll: (filters) => {
    if (Object.keys(filters).length > 0) {
      const keysFilter = Object.keys(filters)
      const newcollection = collection.filter((user) => {
        for (let i = 0; i < keysFilter.length; i++) {
          const filterValues = JSON.parse(filters[keysFilter[i]])
          if (util.findOne(user[keysFilter[i]], filterValues)) {
            return user
          }
        }
        return null
      })
      return Promise.resolve(newcollection)
    }
    return Promise.resolve(collection)
  },
  get: (id) => {
    const user = collection.find(ele => ele.id === id)
    if (user === undefined) return Promise.resolve({})
    return Promise.resolve(user)
  },
  updateById: (id, body) => {
    if (body.hasOwnProperty('role') && body.role !== 'normal' && body.role !== 'admin') {
      return Promise.reject('incorrectRole')
    }
    console.log("dentro de model update")
    return util
      .replace(collection, id, body)
      .then((newcollection) => {
        collection = newcollection
        return newcollection
      })
  },
  removeById: (id) => {
    collection = collection.filter((ele) => {
      if (ele.id === id) {
        idFound = true
      }
      return ele.id !== id
    })
    return Promise.resolve(collection)
  },
  authenticate: (name, password) => {
    return util.findByAttr(collection, 'name', name)
      .then((user) => {
        if (user.password === password) {
          return Promise.resolve(user)
        }
        return Promise.reject('incorrectPsw')
      }, () => Promise.reject('noUser'))
  },
  findByAttr: (attr, value) => {
    return util.findByAttr(collection, attr, value)
  },
  __emptyUsers__: () => {
    collection = collection.filter(ele => ele.role === 'root')
    return Promise.resolve(collection)
  },
  __getCollection__: () => {
    return Promise.resolve(collection)
  }
}
