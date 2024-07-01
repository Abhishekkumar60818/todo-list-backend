const Todo = require('../models/todoModel');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
  const { description, status } = req.body;
  const todo = new Todo({
    description,
    status,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadTodos = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Todo.insertMany(results);
        res.status(201).json({ message: 'Todos uploaded' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
};

exports.downloadTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    const fields = ['_id', 'description', 'status'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(todos);
    res.attachment('todos.csv');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterTodos = async (req, res) => {
  try {
    const { status } = req.query;
    const todos = await Todo.find({ status });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
