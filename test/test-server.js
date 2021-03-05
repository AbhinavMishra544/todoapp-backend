// process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var { app } = require('../server');
var Todo = require('../app/models/TodoSchema');
const jwt = require('jsonwebtoken');
var expect = require('chai').expect;

var should = chai.should();
chai.use(chaiHttp);
let authToken = null;

jwt.sign(
  { name: 'discussions', id: '603fe79d58d512c884636f16' },
  'secret',
  {
    expiresIn: 31556926
  },
  (err, token) => {
    if (token) {
      authToken = `Bearer ${token}`;
    }
  }
);

describe('Todos', async function() {
  it('should list ALL todos on /:user/todos GET', async function() {
    chai
      .request(app)
      .get('/603fe79d58d512c884636f16/todos')
      .set('authorization', authToken)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        should.exist(res);
      });
  });

  it('should update a Todo  on /todos/:todoId POST', async function() {
    chai
      .request(app)
      .post('/todos/604167d59b6587d89ff3e443')
      .set('authorization', authToken)
      .send({
        user: '603fe79d58d512c884636f16',
        status: 'inprogress'
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).should.be.a('object');
        expect(res.body).to.have.property('success');
      });
  });

  it('should get Todos of one type /:user/todos/type POST', async function() {
    chai
      .request(app)
      .post('/603fe79d58d512c884636f16/todos/type')
      .set('authorization', authToken)
      .send({
        status: 'inprogress'
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        should.not.exist(err);
        should.exist(res);
      });
  });

  it('should Add a Todo /todos/add-todo POST', async function() {
    chai
      .request(app)
      .post('/todos/add-todo')
      .set('authorization', authToken)
      .send({
        user: '603fe79d58d512c884636f16',
        name: 'adding a todo',
        date: '2021-03-17'
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).should.be.a('object');
        expect(res.body).to.have.property('success');
        Todo.findOneAndRemove({ name: 'first test task' }, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('deleted successfully');
          }
        });
      });
  });

  it('Should login user and return auth token', async function() {
    chai
      .request(app)
      .post('/users/login')
      .send({
        email: 'pleasedonotdelete@getnada.com',
        password: 'ppppppp'
      })
      .end(async function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).should.be.a('object');
        expect(res.body).to.have.property('success');
        expect(res.body.success).to.equal(true);
      });
  });
});