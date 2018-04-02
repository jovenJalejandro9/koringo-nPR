/* eslint-env mocha */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const User = require('../model/user')
const chaiThings = require('chai-things')
chai.use(chaiHttp)
chai.should()
chai.use(chaiThings)

/*
* Test the User
*/

/*
* POST user
*/
describe('/POST user', () => {
  beforeEach((done) => {
    User.emptyUsers()
      .then(() => done())
      .catch(done)
  })
  it('Without the compulsory fields', (done) =>{
    const user = {
      name: 'Esteban',
      password: 'kilombo',
      tel: '300330022',
      address: 'c/ Vinto'
    }
    chai.request(app)
      .post('/users')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(user)
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('A new user need at least name, first_surname, second_surname, nickname, email, birthday, studies,proffessions and prev_volunteering')
        done()
      })
  })
  it('With a incorrect role. It should normal or admin. By default is normal', (done) =>{
    const user = {
      name: 'Sonia',
      first_surname: 'Lolo',
      second_surname: 'Aria',
      nickname: 'Sonya',
      email: 'sonialolo@gmail.com:',
      birthday: '1984-01-12',
      studies: [
        'journalism',
        'psychology'
      ],
      professions: [
        'teacher',
        'psychologist'
      ],
      prev_volunteering: [
        'AMI3'
      ],
      role: 'almirant'
    }
    chai.request(app)
      .post('/users')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(user)
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('Incorrect Role')
        done()
      })
  })
  it('With the minimun compulsory fileds. We do not fill in the role field. By default is "normal"', (done) =>{
    const user = {
      name: 'Sonia',
      first_surname: 'Lolo',
      second_surname: 'Aria',
      nickname: 'Sonya',
      email: 'sonialolo@gmail.com:',
      password: 'kilombo',
      birthday: '1984-01-12',
      studies: [
        'journalism',
        'psychology'
      ],
      professions: [
        'teacher',
        'psychologist'
      ],
      prev_volunteering: [
        'AMI3'
      ]
    }
    chai.request(app)
      .post('/users')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(user)
      .end((err, res)=>{
        res.should.have.status(201)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(2)
        res.body[0].should.have.property('id').eql(1)
        done()
      })
  })
})
/*
* GET user
*/
describe('/GET  user', () => {
  beforeEach((done) => {
    User.emptyUsers()
      .then(() => done())
      .catch(done)
  })
  const user = {
    name: 'Sonia',
    first_surname: 'Lolo',
    second_surname: 'Aria',
    nickname: 'Sonya',
    email: 'sonialolo@gmail.com:',
    password: 'kilombo',
    birthday: '1984-01-12',
    studies: [
      'journalism',
      'psychology'
    ],
    professions: [
      'teacher',
      'psychologist'
    ],
    prev_volunteering: [
      'AMI3'
    ]
  }
  const user2 = {
    name: 'Arturo',
    first_surname: 'Magallanes',
    second_surname: 'Romero',
    nickname: 'Arturo',
    email: 'arturomaga@gmail.com:',
    password: 'kilombo',
    birthday: '1984-01-12',
    studies: [
      'chef'
    ],
    professions: [
      'chef'
    ],
    prev_volunteering: [
      'AMI3'
    ]
  }
  it('just with the root in the DB. We can do this action with a normal user', (done) => {
    chai.request(app)
      .get('/users')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(1)
        done()
      })
  })

  it('with more users in the db', (done) =>{
    User
      .create(user)
      .then(() => {
        chai.request(app)
          .get('/users')
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .end((err, res)=>{
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eq(2)
            done()
          })
      }
      )
      .catch(done)

  })
  it('with two users in the db and aplying non-existent filter. Ej: color=red', (done) =>{
    User
      .create(user)
      .then(() =>  {
        chai.request(app)
          .get('/users?color=red')
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .end((err, res)=>{
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eq(2)
            const sonia = res.body.find(auxUser => auxUser.name === 'Sonia')
            sonia.should.exist
            done()
          })
      })
      .catch(done)

  })
  it('with two users in the db and aplying an existant filter. Ej: professions=["teacher"]', (done) =>{
    User
      .create(user)
      .then(() =>  {
        chai.request(app)
          .get('/users?professions=["teacher"]')
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .end((err, res)=>{
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eq(1)
            const sonia = res.body.find(auxUser => auxUser.name === 'Sonia')
            sonia.should.exist
            done()
          })
      })
      .catch(done)
  })
  it('with two users in the db and aplying an existant filter with some values. Ej: professions=["teacher","chef"]', (done) =>{
    User
      .create(user)
      .then(() =>
        User
          .create(user2)
          .then(() =>  {
            chai.request(app)
              .get('/users?professions=["teacher","chef"]')
              .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
              .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eq(2)
                const sonia = res.body.find(auxUser => auxUser.name === 'Sonia')
                sonia.should.exist
                done()
              })
          })
      )
      .catch(done)
  })
  it('with two users in the db and aplying differents filters. Ej: professions=["teacher"]&studies=["chef"]', (done) =>{
    User
      .create(user)
      .then(() =>
        User
          .create(user2)
          .then(() =>  {
            chai.request(app)
              .get('/users?studies=["journalism" ]&professions=["chef"]')
              .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
              .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eq(2)
                const sonia = res.body.find(auxUser => auxUser.name === 'Sonia')
                sonia.should.exist
                done()
              })
          })
      )
      .catch(done)
  })
})

/*
* GET user/:id
*/
describe('/GET/:id user', () => {
  beforeEach((done) => {
    User.emptyUsers()
      .then(() => done())
      .catch(done)
  })
  it('with a wrong id. We can do this action with a normal user', (done) =>{
    chai.request(app)
      .get('/users/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('The user is not in the DB')
        done()
      })
  })
  it('with a correct id', (done) =>{
    chai.request(app)
      .get('/users/1')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })
})
/*
* DELETE user
*/
describe('/DELETE  user', () => {
  beforeEach((done) => {
    User.emptyUsers()
      .then(() => done())
      .catch(done)
  })
  const user = {
    name: 'Sonia',
    first_surname: 'Lolo',
    second_surname: 'Aria',
    nickname: 'Sonya',
    email: 'sonialolo@gmail.com:',
    password: 'kilombo',
    birthday: '1984-01-12',
    studies: [
      'journalism',
      'psychology'
    ],
    professions: [
      'teacher',
      'psychologist'
    ],
    prev_volunteering: [
      'AMI3'
    ]
  }
  it('With a bad id ', (done) =>{
    chai.request(app)
      .delete('/users/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('The user is not in the DB')
        done()
      })
  })
  it('with a correct id', (done) =>{
    User
      .create(user)
      .then(() => User.getCollection())
      .then((collection) =>  {
        const deleteId = collection[collection.length - 1].id
        chai.request(app)
          .delete('/users/' + deleteId)
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .end((err, res)=>{
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eq(1)
            done()
          })
      })
      .catch(done)
  })
})

/*
* PATCH user/:id
*/
describe('/PATCH/:id user', () => {
  beforeEach(function setUp(done) {
    User.emptyUsers()
      .then(() => done())
      .catch(done)
  })
  const user = {
    name: 'Sonia',
    first_surname: 'Lolo',
    second_surname: 'Aria',
    nickname: 'Sonya',
    email: 'sonialolo@gmail.com:',
    password: 'kilombo',
    birthday: '1984-01-12',
    studies: [
      'journalism',
      'psychology'
    ],
    professions: [
      'teacher',
      'psychologist'
    ],
    prev_volunteering: [
      'AMI3'
    ]
  }
  it('with a wrong id', (done) => {
    chai.request(app)
      .patch('/users/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('The field does not exist')
        done()
      })
  })
  it('Updating with a incorrect role. It should normal or admin', (done) =>{
    const change = {
      role: 'almirant'
    }
    chai.request(app)
      .patch('/users/20')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(change)
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('Incorrect Role')
        done()
      })
  })
  it('With a correct id and updating a current value', (done) =>{

    const change = {
      name: 'Roberto'
    }
    User
      .create(user)
      .then(() => User.getCollection())
      .then((collection) =>  {
        const updateId = collection[collection.length - 1].id
        chai.request(app)
          .patch('/users/' + updateId)
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .send(change)
          .end((err, res)=>{
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eq(2)
            const roberto = res.body.find(auxUser => auxUser.name === 'Roberto')
            roberto.should.exist
            done()
          })
      })
      .catch(done)
  })
})


