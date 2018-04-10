/* eslint-env mocha */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const State = require('../model/state')
const Sheet = require('../model/sheet')
const chaiThings = require('chai-things')

chai.use(chaiHttp)
chai.should()
chai.use(chaiThings)

/*
* Test the State
*/

/*
* POST state
*/
describe('/POST state', () => {
  beforeEach((done) => {
    State.__emptyCollection__()
      .then(() => {
        Sheet.__emptyCollection__()
          .then(() => done())
      })
      .catch(done)
  })
  it('should return a Incorrect token error when trying to create a state without the compulsory fields', (done) => {
    const state = {
      "value": {
          "start_year": 2017,
          "name": "Jesus de Prada",
          "observations": ""
      },
      "user_id": 1, 
      "remote_id": 3, 
      "remote_collection": "sheet", 
      "field_name" : "free_time"
    }
    State
      .create(state)
      .then(() => {
        State
      })
    chai.request(app)
      .post('/states')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(state)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('A new state need at least a prev_state_id, value, user_id and sheet_id')
        done()
      })
  })
  it('should return a Incorrect token error when trying to create a state with a non-existent prevId', (done) => {
    const state = {
      "prev_state_id": 323,
      "value": {
          "start_year": 2017,
          "name": "Jesus de Prada",
          "observations": ""
      },
      "user_id": 1, 
      "remote_id": 3, 
      "remote_collection": "sheet", 
      "field_name" : "free_time"
    }
    chai.request(app)
      .post('/states')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(state)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('The previous id should be null or a available idState')
        done()
      })
  })
  it('should return a Incorrect token error when trying to create a state with a non-available prevId', (done) => {
    const state1 = {
      "prev_state_id": null,
      "value": {
          "start_year": 2017,
          "name": "Jesus de Prada",
          "observations": ""
      },
      "user_id": 1, 
      "remote_id": 3, 
      "remote_collection": "sheet", 
      "field_name" : "free_time"
    }
    const state3 = {
      "prev_state_id": 23,
      "value": {
          "start_year": 2017,
          "name": "Jesus de Prada",
          "observations": ""
      },
      "user_id": 1, 
      "remote_id": 3, 
      "remote_collection": "sheet", 
      "field_name" : "free_time"
    }
    State
      .create(state1)
      .then((states) => {
        const state2 = {
          "value": {
              "start_year": 2017,
              "name": "Jesus de Prada",
              "observations": ""
          },
          "user_id": 1, 
          "remote_id": 3, 
          "remote_collection": "sheet", 
          "field_name" : "free_time"
        }
        state2.prev_state_id = states[0].id
        State
          create(state2)
          then(() => {

          })
            chai.request(app)
            .post('/states')
            .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
            .send(state2)
            .end((err, res) => {
              res.should.have.status(400)
              res.body.should.be.a('object')
              res.body.should.have.property('code')
              res.body.should.have.property('message')
              res.body.should.have.property('message').eql('The previous id should not be assigned')
              done()
            })
      })  
  })
})
// /*
// * GET state/:id
// */
// describe('/GET/:id state', () => {
//   beforeEach((done) => {
//     State.__emptyCollection__()
//       .then(() => {
//         Sheet.__emptyCollection__()
//           .then(() => done())
//       })
//       .catch(done)
//   })
//   const state = {
//     id: 1,
//     prev_state_id: null,
//     value: {
//       diagnose: 'Autism',
//       start_year: 1993
//     },
//     user_id: 3,
//     remote_id: 1,
//     remote_collection: 'sheet',
//     field_name: 'medical_history'
//   }
//   it('should return an empty json token when trying to get the states with wrong idState', (done) => {
//     chai.request(app)
//       .get('/states/22')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send()
//       .end((err, res) => {
//         res.should.have.status(200)
//         res.body.should.be.a('object')
//         Object.keys(res.body).length.should.be.eq(0)
//         done()
//       })
//   })
//   it('should return a json collection when trying to get the states with correct idState', (done) => {
//     State
//       .create(state)
//       .then((states) => {
//         chai.request(app)
//           .get('/states/' + states[0].id)
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .send()
//           .end((err, res) => {
//             res.should.have.status(200)
//             res.body.should.be.a('object')
//             done()
//           })
//       })

//   })
// })
