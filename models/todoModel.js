const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Todo', TodoSchema);
