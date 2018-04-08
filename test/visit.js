/* eslint-env mocha */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const Visit = require('../model/visit')
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
        res.body.should.have.property('message').eql('A new sheet should have at least sheetId and userId')
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
// /*
// * GET visit
// */
// describe('/GET  visit', () => {
//   beforeEach((done) => {
//     Visit.__emptyVisits__()
//       .then(() => done())
//       .catch(done)
//   })
//   const visit = {
//     sheetId: 1,
//     user_id: 1,
//     date: 'Wed Feb 28'
// }
//   const visit2 = {
//     name: 'Arturo',
//     first_surname: 'Magallanes',
//     second_surname: 'Romero',
//     nickname: 'Arturo',
//     email: 'arturomaga@gmail.com:',
//     password: 'kilombo',
//     birthday: '1984-01-12',
//     studies: [
//       'chef'
//     ],
//     professions: [
//       'chef'
//     ],
//     prev_volunteering: [
//       'AMI3'
//     ]
//   }
//   it('should return a json collection when trying to get the visits just with the root on the DB', (done) => {
//     chai.request(app)
//       .get('/visits')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .end((err, res)=>{
//         res.should.have.status(200)
//         res.body.should.be.a('array')
//         res.body.length.should.be.eq(1)
//         done()
//       })
//   })

//   it('should return a json collection when trying to get the visits just with more on the DB', (done) =>{
//     Visit
//       .create(visit)
//       .then(() => {
//         chai.request(app)
//           .get('/visits')
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .end((err, res)=>{
//             res.should.have.status(200)
//             res.body.should.be.a('array')
//             res.body.length.should.be.eq(2)
//             done()
//           })
//       })
//       .catch(done)

//   })
//   it('should return a json collection when trying to get the visits with a invented filter Ej: color=red', (done) =>{
//     Visit
//       .create(visit)
//       .then(() =>  {
//         chai.request(app)
//           .get('/visits?color=red')
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .end((err, res)=>{
//             res.should.have.status(200)
//             res.body.should.be.a('array')
//             res.body.length.should.be.eq(2)
//             const sonia = res.body.find(auxVisit => auxVisit.name === 'Sonia')
//             sonia.should.exist
//             done()
//           })
//       })
//       .catch(done)

//   })
//   it('should return a json collection when trying to get the visits just with an existante filter. Ej: professions=["teacher"]', (done) =>{
//     Visit
//       .create(visit)
//       .then(() =>  {
//         chai.request(app)
//           .get('/visits?professions=["teacher"]')
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .end((err, res)=>{
//             res.should.have.status(200)
//             res.body.should.be.a('array')
//             res.body.length.should.be.eq(1)
//             const sonia = res.body.find(auxVisit => auxVisit.name === 'Sonia')
//             sonia.should.exist
//             done()
//           })
//       })
//       .catch(done)
//   })
//   it('should return a json collection when trying to get the visits just with an existante filter with some values. Ej: professions=["teacher","chef"]', (done) =>{
//     Visit
//       .create(visit)
//       .then(() =>
//         Visit
//           .create(visit2)
//           .then(() =>  {
//             chai.request(app)
//               .get('/visits?professions=["teacher","chef"]')
//               .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//               .end((err, res)=>{
//                 res.should.have.status(200)
//                 res.body.should.be.a('array')
//                 res.body.length.should.be.eq(2)
//                 const sonia = res.body.find(auxVisit => auxVisit.name === 'Sonia')
//                 sonia.should.exist
//                 done()
//               })
//           })
//       )
//       .catch(done)
//   })
//   it('should return a json collection when trying to get the visits with differents correct filters. Ej: professions=["teacher"]&studies=["chef"]', (done) =>{
//     Visit
//       .create(visit)
//       .then(() =>
//         Visit
//           .create(visit2)
//           .then(() =>  {
//             chai.request(app)
//               .get('/visits?studies=["journalism" ]&professions=["chef"]')
//               .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//               .end((err, res)=>{
//                 res.should.have.status(200)
//                 res.body.should.be.a('array')
//                 res.body.length.should.be.eq(2)
//                 const sonia = res.body.find(auxVisit => auxVisit.name === 'Sonia')
//                 sonia.should.exist
//                 done()
//               })
//           })
//       )
//       .catch(done)
//   })
// })

// /*
// * GET visit/:id
// */
// describe('/GET/:id visit', () => {
//   beforeEach((done) => {
//     Visit.__emptyVisits__()
//       .then(() => done())
//       .catch(done)
//   })
//   it('should return a json collection when trying to get the visits with wrong idVisit', (done) =>{
//     chai.request(app)
//       .get('/visits/22')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send()
//       .end((err, res)=>{
//         res.should.have.status(200)
//         res.body.should.be.a('object')
//         done()
//       })
//   })
//   it('should return a json collection when trying to get the visits with correct idVisit', (done) =>{
//     chai.request(app)
//       .get('/visits/1')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send()
//       .end((err, res)=>{
//         res.should.have.status(200)
//         res.body.should.be.a('object')
//         done()
//       })
//   })
// })
// /*
// * DELETE visit
// */
// describe('/DELETE  visit', () => {
//   beforeEach((done) => {
//     Visit.__emptyVisits__()
//       .then(() => done())
//       .catch(done)
//   })
//   const visit = {
//     name: 'Sonia',
//     first_surname: 'Lolo',
//     second_surname: 'Aria',
//     nickname: 'Sonya',
//     email: 'sonialolo@gmail.com:',
//     password: 'kilombo',
//     birthday: '1984-01-12',
//     studies: [
//       'journalism',
//       'psychology'
//     ],
//     professions: [
//       'teacher',
//       'psychologist'
//     ],
//     prev_volunteering: [
//       'AMI3'
//     ]
//   }
//   it('should return a json collection when trying to get the visits just with wrong idVisit', (done) =>{
//     chai.request(app)
//       .delete('/visits/22')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send()
//       .end((err, res)=>{
//         res.should.have.status(200)
//         res.body.should.be.a('array')
//         done()
//       })
//   })
//   it('should return a json collection when trying to get the visits just with correct idVisit', (done) =>{
//     Visit
//       .create(visit)
//       .then((collection) =>  {
//         const deleteId = collection[collection.length - 1].id
//         chai.request(app)
//           .delete('/visits/' + deleteId)
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .end((err, res)=>{
//             res.should.have.status(200)
//             res.body.should.be.a('array')
//             res.body.length.should.be.eq(1)
//             done()
//           })
//       })
//       .catch(done)
//   })
// })

// /*
// * PATCH visit/:id
// */
// describe('/PATCH/:id visit', () => {
//   beforeEach(function setUp(done) {
//     Visit.__emptyVisits__()
//       .then(() => done())
//       .catch(done)
//   })
//   const visit = {
//     name: 'Sonia',
//     first_surname: 'Lolo',
//     second_surname: 'Aria',
//     nickname: 'Sonya',
//     email: 'sonialolo@gmail.com:',
//     password: 'kilombo',
//     birthday: '1984-01-12',
//     studies: [
//       'journalism',
//       'psychology'
//     ],
//     professions: [
//       'teacher',
//       'psychologist'
//     ],
//     prev_volunteering: [
//       'AMI3'
//     ]
//   }
//   it('should return a Incorrect token error when trying to patch the visits with a wrong idVisit', (done) => {
//     chai.request(app)
//       .patch('/visits/22')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send()
//       .end((err, res)=>{
//         res.should.have.status(400)
//         res.body.should.be.a('object')
//         res.body.should.have.property('code')
//         res.body.should.have.property('message')
//         res.body.should.have.property('message').eql('The field does not exist')
//         done()
//       })
//   })
//   it('should return a Incorrect token error when trying to patch the visits with a wrong role', (done) =>{
//     const change = {
//       role: 'almirant'
//     }
//     chai.request(app)
//       .patch('/visits/20')
//       .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//       .send(change)
//       .end((err, res)=>{
//         res.should.have.status(400)
//         res.body.should.be.a('object')
//         res.body.should.have.property('code')
//         res.body.should.have.property('message')
//         res.body.should.have.property('message').eql('Incorrect Role')
//         done()
//       })
//   })
//   it('should return a json collection when trying to patch a visit with everything OK', (done) =>{

//     const change = {
//       name: 'Roberto'
//     }
//     Visit
//       .create(visit)
//       .then((collection) =>  {
//         const updateId = collection[collection.length - 1].id
//         chai.request(app)
//           .patch('/visits/' + updateId)
//           .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxMDQzMzE5fQ.u25KdsjXHaVU3G3PQgPiFy7KIWbfdIi6NyT6qjIQP3o')
//           .send(change)
//           .end((err, res)=>{
//             res.should.have.status(200)
//             res.body.should.be.a('array')
//             res.body.length.should.be.eq(2)
//             const roberto = res.body.find(auxVisit => auxVisit.name === 'Roberto')
//             roberto.should.exist
//             done()
//           })
//       })
//       .catch(done)
//   })
// })


