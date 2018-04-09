/* eslint-env mocha */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Visit = require('../\/visit')
const Sheet = require('../model/sheet')
const chaiThings = require('chai-things')

chai.use(chaiHttp)
chai.should()
chai.use(chaiThings)

/*
* Test the Visit
*/

/*
* POST visit
*/
describe('/POST visit', () => {
  beforeEach((done) => {
    Visit.__emptyCollection__()
      .then(() => {
				Sheet.__emptyCollection__()
				.then(() => done())
			})
      .catch(done)
	})
  it('should return a Incorrect token error when trying to create a visit without the compulsory fields', (done) => {
    const visit = {
        sheetId: 1,
        date: 'Wed Feb 28'
    }
    chai.request(app)
      .post('/visits')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(visit)
      .end((err, res)=>{
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('A new visit should have at least sheetId and userId')
        done()
      })
	})
  it('should return a Incorrect token error when trying to create a visit with a wrong sheetId', (done) => {
    const visit = {
        sheetId: 12,
        user_id: 1,
        date: 'Wed Feb 28'
    }
    chai.request(app)
      .post('/visits')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send(visit)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.should.have.property('code')
        res.body.should.have.property('message')
        res.body.should.have.property('message').eql('This sheet does not exist')
        done()
      })
	})
	it('should return a Incorrect token error when trying to create a visit with a wrong sheetId', (done) => {
		const visit = {
			sheetId: 1,
			user_id: 112,
			date: 'Wed Feb 28'
		}
		chai.request(app)
		.post('/visits')
		.set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
		.send(visit)
		.end((err, res) => {
				res.should.have.status(400)
				res.body.should.be.a('object')
				res.body.should.have.property('code')
				res.body.should.have.property('message')
				res.body.should.have.property('message').eql('This user does not exist')
				done()
		})
	})
  it('should return a json collection when trying to create an visit with every fields', (done) =>{
    const sheet = {
			"id": 2,
			"name": "Amparo",
			"first_surname": "Ribola",
			"address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
			"zone": "Chiclayo"
    }
    Sheet
			.create(sheet)
			.then((sheets) => {
			const visit = {
					user_id: 1,
					date: 'Wed Feb 28'
			}
			visit.sheetId = sheets[0].id
				chai.request(app)
				.post('/visits')
				.set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
				.send(visit)
				.end((err, res)=>{
						res.should.have.status(201)
						res.body.should.be.a('array')
						res.body.length.should.be.eq(1)
						done()
				})

			})
  })
})
/*
* GET visit
*/
describe('/GET  visit', () => {
	beforeEach((done) => {
		Visit.__emptyCollection__()
		  .then(() => {
					Sheet.__emptyCollection__()
					.then(() => done())
				})
		  .catch(done)
		})
  const visit = {
    sheetId: 1,
    user_id: 1,
    date: 'Wed Feb 28'
}
  it('should return a empty json collection when trying to get the visits when the db is empty', (done) => {
    chai.request(app)
      .get('/visits')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eq(0)
        done()
      })
  })

  it('should return a json collection when trying to get the visits with one visit on the db', (done) =>{
    Visit
      .create(visit)
      .then(() => {
        chai.request(app)
          .get('/visits')
          .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
          .end((err, res) => {
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
* GET visit/:id
*/
describe('/GET/:id visit', () => {
  beforeEach((done) => {
    Visit.__emptyCollection__()
      .then(() => {
				Sheet.__emptyCollection__()
				.then(() => done())
			})
      .catch(done)
	})
  it('should return an empty json token when trying to get the visits with wrong idVisit', (done) =>{
    chai.request(app)
      .get('/visits/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
				res.body.should.be.a('object')
				Object.keys(res.body).length.should.be.eq(0)
        done()
      })
  })
  it('should return a json collection when trying to get the visits with correct idVisit', (done) =>{
    const sheet = {
			"name": "Amparo",
			"first_surname": "Ribola",
			"address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
			"zone": "Chiclayo"
    }
    Sheet
      .create(sheet)
      .then((sheets) => {
      const visit = {
          user_id: 1,
          date: 'Wed Feb 28'
      }
      visit.sheetId = sheets[0].id
        Visit
          .create(visit)
            .then((visits) => {
              chai.request(app)
              .get('/visits/'+ visits[0].id)
              .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
              .send()
              .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
              })
            })
        })
  })
})
/*
* DELETE visit
*/
describe('/DELETE  visit', () => {
  beforeEach((done) => {
    Visit.__emptyCollection__()
      .then(() => {
				Sheet.__emptyCollection__()
				.then(() => done())
			})
      .catch(done)
	})

  it('should return an empty json collection when trying to delete a visit with a wrong idVisit', (done) =>{
    chai.request(app)
      .delete('/visits/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        done()
      })
  })
  it('should return a json collection when trying to get the visits just with correct idVisit', (done) => {
    const sheet = {
			"name": "Amparo",
			"first_surname": "Ribola",
			"address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
			"zone": "Chiclayo"
    }    
    Sheet
    .create(sheet)
    .then((sheets) => {
    const visit = {
        user_id: 1,
        date: 'Wed Feb 28'
    }
    visit.sheetId = sheets[0].id
      Visit
        .create(visit)
          .then((visits) => {
            chai.request(app)
            .delete('/visits/'+ visits[0].id)
            .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
            .send()
            .end((err, res)=>{
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.length.should.be.eq(0)
              done()
            })
          })
      })
  })
})

/*
* PATCH visit/:id
*/
describe('/PATCH/:id visit', () => {
  beforeEach((done) => {
    Visit.__emptyCollection__()
      .then(() => {
				Sheet.__emptyCollection__()
				.then(() => done())
			})
      .catch(done)
	})
  const visit = {
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
  it('should return an empty json collection when trying to parch a visits with wrong idVisit', (done) => {
    chai.request(app)
      .patch('/visits/22')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
      .send()
      .end((err, res)=>{
        res.should.have.status(200)
        res.body.should.be.a('array')
        done()
      })
  })
})
  it('should return a json collection when trying to patch a visit with everything OK', (done) =>{
    const change = {
      name: 'Roberto'
    }
    const sheet = {
			"name": "Amparo",
			"first_surname": "Ribola",
			"address": "Pueblo Joven 5 de Noviembre 43, Chiclayo",
			"zone": "Chiclayo"
    }
    Sheet
      .create(sheet)
      .then((sheets) => {
      const visit = {
          user_id: 1,
          date: 'Wed Feb 28'
      }
      const change = {
      }
      visit.sheetId = sheets[0].id
        Visit
          .create(visit)
            .then((visits) => {
              chai.request(app)
              .patch('/visits/'+ visits[0].id)
              .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
              .send(change)
              .end((err, res)=>{
                res.should.have.status(200)
                res.body.should.be.a('array')
                done()
              })
            })
        })
 })