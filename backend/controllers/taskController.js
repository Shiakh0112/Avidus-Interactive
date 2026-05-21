const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    await ActivityLog.create({ user: req.user._id, action: 'TASK_CREATED', details: `Task: ${task.title}` });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    Object.assign(task, req.body);
    await task.save();
    await ActivityLog.create({ user: req.user._id, action: 'TASK_UPDATED', details: `Task: ${task.title}` });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    await ActivityLog.create({ user: req.user._id, action: 'TASK_DELETED', details: `Task: ${task.title}` });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
