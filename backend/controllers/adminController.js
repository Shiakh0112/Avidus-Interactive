const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('user', 'name email');
  res.json(tasks);
};

exports.adminDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await ActivityLog.create({ user: req.user._id, action: 'ADMIN_TASK_DELETED', details: `Task: ${task.title}` });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  const logs = await ActivityLog.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(logs);
};

exports.getStats = async (req, res) => {
  const [totalUsers, totalTasks, completedTasks, pendingTasks] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: 'Completed' }),
    Task.countDocuments({ status: 'Pending' }),
  ]);
  res.json({ totalUsers, totalTasks, completedTasks, pendingTasks });
};
