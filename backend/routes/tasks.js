const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createTask, getMyTasks, updateTask, deleteTask } = require('../controllers/taskController');

router.use(protect);
router.post('/', createTask);
router.get('/', getMyTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
