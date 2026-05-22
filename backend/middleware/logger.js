const ActivityLog = require('../models/ActivityLog');

const log = (action, details = '') => async (req, res, next) => {
  try {
    if (req.user) await ActivityLog.create({ user: req.user._id, action, details });
  } catch {}
  next();
};

module.exports = log;
