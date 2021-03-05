const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    default: 'inprogress'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('todo', TodoSchema);

module.exports = Todo;
