'use strict';
/**
 * Module dependencies.
 */
const user = require('../app/controllers/user');
const todos = require('../app/controllers/todos');
const { isValidUser } = require('./../app/controllers/auth');

module.exports = function(app) {
  app.post('/users/login', user.login);
  app.post('/users/register', user.register);
  app.post('/todos/add-todo', isValidUser, todos.addTodo);
  app.get('/:user/todos', isValidUser, todos.getTodos);
  app.post('/:user/todos/type', isValidUser, todos.getTodosOfOneType);
  app.post('/todos/:todoId', isValidUser, todos.changeTodoStatus);

  app.use(function(err, req, res, next) {
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
