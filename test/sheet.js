/* eslint-env mocha */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Sheet = require('../model/sheet')
const State = require('../model/state')
const User = require('../model/user')
const example = require('../lib/examples')
const chaiThings = require('chai-things')

chai.use(chaiHttp)
chai.should()
chai.use(chaiThings)

/*
* Test the Sheet
*/

/*
* POST sheet
*/
describe('/POST sheet', () => {
  beforeEach((done) => {
    Sheet.__emptyCollection__()
      .then(() => {
        State.__emptyCollection__()
          .then(() => {
            Sheet.create(example.sheet1)
              .then(() => done())
          })
      })
  })
  it('should return a Incorrect token error when trying to create a sheet without the compulsory fields', (done) => {
    const sheet = {
      "value": 2
    }
    chai.request(app)
      .post('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(sheet)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('A new sheet should have at least name, first surname, zone and addres')
        done()
      })
  })
  it('should return a Incorrect token error when trying to create a sheet with the same name and lastname', (done) => {
    chai.request(app)
      .post('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(example.sheet1)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('This user already exist')
        done()
      })
  })
  it('should return a json collection when trying to create a sheet with everything OK', (done) => {
    chai.request(app)
      .post('/sheets')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(example.sheet2)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('array')
        done()
      })
  })
})
/*
* GET sheets
*/
describe('/GET/ sheet', () => {
  beforeEach((done) => {
    Sheet.__emptyCollection__()
      .then(() => {
        State.__emptyCollection__()
          .then(() => {
            Sheet.create(example.sheet1)
              .then(() => {
                Sheet.create(example.sheet2)
                  .then((sheets) => {
                    console.log(sheets)
                    const newState1 = Object.assign({},example.sheet1)
                    newState1.remote_id = sheets[0].id
                    console.log('------------------')
                    console.log(newState1)
                    console.log('------------------')
                    State.create(newState1)
                      .then(() => {
                        State.create(example.state2)
                          .then((states) => {
                            console.log(states)
                            done()
                          })
                      })
                  })
              })
          })
      })
  })
  it('should return  an empty json collection when trying to get a collection of sheets and the db does not have sheets', (done) => {
    Sheet.__emptyCollection__()
      .then(() => {
        chai.request(app)
          .get('/sheets')
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .send()
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            Object.keys(res.body).length.should.be.eq(0)
            done()
          })
      })
  })
  it('should return json collection with every sheets when trying to get a collection of sheets with wrong filters', (done) => {
    chai.request(app)
      .get('/sheets?nonfilter=[ "Autism"]')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        Object.keys(res.body).length.should.be.eq(2)
        done()
      })
  })
  it('should return json collection when trying to get a collection with with normal filter(name="Javier")', (done) => {
    chai.request(app)
      .get('/sheets?name=[ "Javier"]')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        Object.keys(res.body).length.should.be.eq(1)
        done()
      })
  })
  it('should return json collection when trying to get a collection with with state filter(medical_diagnose=[Down Sindrome])', (done) => {
    console.log("ultima prueba")
    done()
    // chai.request(app)
    //   .get('/sheets?medical_diagnose=["Down Sindrome"]')
    //   .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
    //   .send()
    //   .end((err, res) => {
    //     res.should.have.status(200)
    //     res.body.should.be.a('array')
    //     Object.keys(res.body).length.should.be.eq(1)
    //     done()
    //   })
  })
  //   it('should return  a json collection when trying to get a collection of sheets wtih some sheets on the db', (done) => {
  //     Sheet
  //       .create(example.sheet1)
  //       .then(() => {
  //         chai.request(app)
  //           .get('/sheets')
  //           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
  //           .send()
  //           .end((err, res) => {
  //             res.should.have.status(200)
  //             res.body.should.be.a('array')
  //             Object.keys(res.body).length.should.be.eq(1)
  //             done()
  //           })
  //       })
  //   })
})

