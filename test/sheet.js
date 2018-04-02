/* eslint-env mocha */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Sheet = require('../model/sheet')
const chaiThings = require('chai-things')
chai.use(chaiHttp)
chai.should()
chai.use(chaiThings)

/*
* Test the Sheet
*/

/*
* POST Sheet
*/
describe('/POST sheet', () => {
  it('Without the compulsory fields', (done) =>{
    beforeEach(function setUp() {
      Sheet.emptySheets()
    })
    const sheet = {
      // name: 'Carlos',
      // first_surname: 'Vilchez',
      address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
      zone: 'Chiclayo'
    }

    chai.request(app)
      .post('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
   	  .send(sheet)
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('A new sheet need at least the fields name, firstSurname, secondSurname, tel and address')
        done()
      })
  })
  it('With the minimun compulsory fileds', (done) =>{
    const sheet = {
      name: 'Carlos',
      first_surname: 'Vilchez',
      address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
      zone: 'Chiclayo'
    }
    chai.request(app)
      .post('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(sheet)
      .end((err, res)=>{
        res.should.have.status(201)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(1)
        res.body[0].should.have.property('id').eql(1)
        done()
      })
  })
})

/*
* GET sheet
*/
describe('/GET  sheet', () => {
  beforeEach(function setUp() {
    Sheet.emptySheets()
  })
  it('Without sheets in the DB', (done) =>{
    chai.request(app)
      .get('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('There are not Sheet in the DB')
        done()
      })
  })
  it('with some shets at the DB', (done) =>{
    const sheet = {
      name: 'Jose',
      first_surname: 'Hernandez',
      address: 'Pueblo Joven 5 de Noviembre 43, Chiclayo',
      zone: 'Chiclayo'
    }
    const sheet2 = {
      name: 'Carlos',
      first_surname: 'Vilchez',
      address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
      zone: 'Chiclayo'
    }
    Sheet.create(sheet)
    Sheet.create(sheet2)
    chai.request(app)
      .get('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(2)
        done()
      })
  })
})

/*
* GET Sheet/:id
*/
describe('/GET/:id sheet', () => {
  it('with a wrong id', (done) =>{
    beforeEach(function setUp() {
      Sheet.emptySheets()
    })
    chai.request(app)
      .get('/sheets/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('There is not Sheet with this id')
        done()
      })
  })
  it('with a correct id', (done) =>{
    Sheet.addSheet({id: 34, name: 'Alejandro'})
    chai.request(app)
      .get('/sheets/34')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })
})

/*
* DELETE sheet
*/
describe('/DELETE  sheet', () => {
  beforeEach(function setUp() {
    Sheet.emptySheets()
    const sheet = {
      id: 34,
      name: 'Carlos',
      first_surname: 'Vilchez',
      address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
      zone: 'Chiclayo'
    }
    // We create a new normal user
    Sheet.addSheet(sheet)
  })
  it('With a bad id ', (done) =>{
    chai.request(app)
      .delete('/sheets/4')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('errors')
        res.body.errors.should.have.property('message').eql('There is not Sheet with this id')
        done()
      })
  })

  it('with a correct id', (done) =>{
    chai.request(app)
      .delete('/sheets/34')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .set('user', '{"role":"admin"}')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(0)
        done()
      })
  })
})

/*
* PATCH sheet/:id
*/
describe('/PATCH/:id sheet', () => {
  beforeEach(function setUp() {
    Sheet.emptySheets()
    const sheet = {
      id: 34,
      name: 'Carlos',
      first_surname: 'Vilchez',
      address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
      zone: 'Chiclayo'
    }
    // We create a new normal user
    Sheet.addSheet(sheet)
  })
  it('with a wrong id', (done) =>{
    chai.request(app)
      .patch('/sheets/22')
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
  it('With a correct id and updating a current value', (done) =>{
    const change = {
      name: 'Roberto'
    }
    chai.request(app)
      .patch('/sheets/34')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(change)
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(1)
        res.body.should.be.a('array').that.include({
          id: 34,
          name: 'Roberto',
          first_surname: 'Vilchez',
          address: 'Pueblo Joven 4 de Noviembre 23, Chiclayo',
          zone: 'Chiclayo'
        })
        done()
      })
  })
})
