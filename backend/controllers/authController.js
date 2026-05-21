const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: generateToken(user._id), user: { _id: user._id, name, email, role: user.role, status: user.status } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.status === 'Inactive') return res.status(403).json({ message: 'Account is inactive' });
    await ActivityLog.create({ user: user._id, action: 'LOGIN', details: `${user.email} logged in` });
    res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
