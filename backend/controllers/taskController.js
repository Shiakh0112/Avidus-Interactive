const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
    const task = await Task.create({ title: title.trim(), description: description?.trim(), user: req.user._id });
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
    const { title, description, status } = req.body;
    const allowedStatus = ['Pending', 'Completed'];
    if (status && !allowedStatus.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status;
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
