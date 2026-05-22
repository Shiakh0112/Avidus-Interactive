const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, deleteUser, updateUserStatus, getAllTasks, adminDeleteTask, getActivityLogs, getStats } = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', adminDeleteTask);
router.get('/logs', getActivityLogs);

module.exports = router;
