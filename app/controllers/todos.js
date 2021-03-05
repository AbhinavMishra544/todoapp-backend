const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Todo = require('../../app/models/TodoSchema');
const User = require('../../app/models/UserSchema');
module.exports = {
  getTodos: async (req, res) => {
    Todo.find({ user: req.params.user })
      .then(todos => {
        res.json(todos);
      })
      .catch(() => {
        res.json({
          status: 'error',
          msg: 'something went wrong'
        });
      });
  },
  addTodo: async (req, res) => {
    User.findOne({ _id: req.body.user }).then(user => {
      if (!user) {
        return res.status(400).json({ message: 'user does not exist' });
      } else {
        const newTodo = new Todo({
          name: req.body.name,
          user: req.body.user,
          date: req.body.date
        });

        newTodo
          .save()
          .then(() => res.json({ success: true }))
          .catch(err => console.log(err));
      }
    });
  },
  getTodosOfOneType: async (req, res) => {
    const user = req.params.user;
    const queryOptions = [{ user: req.params.user }];

    if (req.body.status === 'completed' || req.body.status === 'inprogress') {
      queryOptions.push({ status: req.body.status });
    }

    if (user) {
      Todo.find({
        $and: queryOptions
      }).then(todos => {
        res.json(todos);
      });
    } else {
      res.status(400).json({ message: 'user does not exist' });
    }
  },
  changeTodoStatus: (req, res) => {
    User.findOne({ _id: ObjectId(req.body.user) })
      .then(user => {
        if (!user) {
          return res.status(400).json({ message: 'user does not exist' });
        } else {
          Todo.findOneAndUpdate(
            { _id: ObjectId(req.params.todoId) },
            { status: req.body.status },
            err => {
              if (err) {
                console.log(err);
                return res
                  .status(400)
                  .json({ message: 'todo item reference not found' });
              }
              return res.status(200).json({ success: true });
            }
          );
        }
      })
      .catch(err => console.log(err));
  }
};
