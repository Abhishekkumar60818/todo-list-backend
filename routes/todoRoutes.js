const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  uploadTodos,
  downloadTodos,
  filterTodos,
} = require('../controllers/todoController');

router.get('/todos', getAllTodos);
router.get('/todos/:id', getTodoById);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);
router.post('/todos/upload', upload.single('file'), uploadTodos);
router.get('/todos/download', downloadTodos);
router.get('/todos/filter', filterTodos);

module.exports = router;
