const util = require('../lib/utils')
const error = require('../lib/error')
const user1 = {
  id: 1,
  name: 'root',
  password: -712138119,
  role: 'root'
}
const attrsUser = ['name', 'first_surname', 'second_surname', 'nickname', 'password', 'email', 'birthday', 'studies', 'professions', 'prev_volunteering', 'role']
let collection = [user1]
let idUser = collection.length

module.exports = {
  create: (initialBody) => {
    const body = util.pick(initialBody, attrsUser)
    if (body.hasOwnProperty('id')) {
      return Promise.reject(error.noId())
    }
    if (body.hasOwnProperty('name')
      && body.hasOwnProperty('first_surname') && body.hasOwnProperty('second_surname')
      && body.hasOwnProperty('nickname') && body.hasOwnProperty('email')
      && body.hasOwnProperty('birthday') && body.hasOwnProperty('studies')
      && body.hasOwnProperty('professions') && body.hasOwnProperty('prev_volunteering')) {
      const user = Object.assign({}, body)
      if (!user.hasOwnProperty('role')) {
        user.role = 'normal'
      }

      if (user.role !== 'normal' && user.role !== 'admin') {
        return Promise.reject(error.incorrectRole())
      }
      // Creating the new user
      idUser ++
      user.id = idUser
      // Creating the pasword
      user.password = util.hashCode(user.password)
      user.timestamp = util.getDate()
      collection.push(user)
      return Promise.resolve(collection)
    }
    return Promise.reject(error.noInfoCreateUser())
  },
  getAll: (filterGet) => {
    if (collection.length <= 0) {
      return Promise.reject(error.noUsers())
    }
    // Proffesion filter
    let newcollection = collection.slice()
    if (filterGet.hasOwnProperty('professions') || filterGet.hasOwnProperty('studies')) {
      newcollection = collection.filter((ele) => {
        if (filterGet.hasOwnProperty('professions')) {
          if (ele.hasOwnProperty('professions')) {
            const filterProf = JSON.parse(filterGet.professions)
            for (let i = 0; i < filterProf.length; i++) {
              if (ele.professions.includes(filterProf[i])) {
                return ele
              }
            }
          }
        }
        if (filterGet.hasOwnProperty('studies')) {
          if (ele.hasOwnProperty('studies')) {
            const filterStud = JSON.parse(filterGet.studies)
            for (let i = 0; i < filterStud.length; i++) {
              if (ele.studies.includes(filterStud[i])) {
                return ele
              }
            }
          }
        }
        return null
      })
    }
    return Promise.resolve(newcollection)
  },
  get: (id) => {
    const user = collection.find((ele) => {
      return ele.id === id
    })
    if (user === undefined) {
      return Promise.reject(error.noUser())
    }
    return Promise.resolve(user)

  },
  updateById: (id, initialBody) => {
    const body = util.pick(initialBody, attrsUser)
    if (body.hasOwnProperty('role')) {
      if (body.role !== 'normal' && body.role !== 'admin') {
        return Promise.reject(error.incorrectRole())
      }
    }
    return util
      .replace(collection, parseInt(id, 10), body)
      .then((newcollection) => {
        collection = newcollection
        return newcollection
      })
  },
  removeById: (id) => {
    let idFound = false
    collection = collection.filter((ele) => {
      if (ele.id === id) {
        idFound = true
      }
      return ele.id !== id
    })
    if (idFound) {
      return Promise.resolve(collection)
    }
    return Promise.reject(error.noUser())
  },
  authenticate: (name, password) => {
    const user = collection.find((ele) => {
      return ele.name === name
    })
    if (!user) return Promise.reject(error.noUser())
    if (user.password === util.hashCode(password)) {
      return Promise.resolve(user)
    }
    return Promise.reject(error.incorrectPsw())
  },
  findByAttr: (attr, value) => {
    return util.findByAttr(collection, attr, value)
  },
  emptyUsers: () => {
    collection = collection.filter(ele => ele.role === 'root')
    return Promise.resolve(collection)
  },
  getCollection: () => {
    return Promise.resolve(collection)
  }
}
