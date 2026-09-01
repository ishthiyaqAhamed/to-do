const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, assignToSelf } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      creator: req.user._id,
      assignedTo: assignToSelf ? req.user._id : null,
    });

    const populated = await task.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'doing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isOwner =
      task.creator.toString() === req.user._id.toString() ||
      (task.assignedTo && task.assignedTo.toString() === req.user._id.toString());

    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'You can only move tasks you created or are assigned to' });
    }

    task.status = status;
    await task.save();

    const populated = await task.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task status', error: err.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'admin') {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ message: 'userId is required for admin assignment' });
      task.assignedTo = userId;
    } else {
      if (task.assignedTo) {
        return res.status(403).json({ message: 'This task is already assigned to someone' });
      }
      task.assignedTo = req.user._id;
    }

    await task.save();
    const populated = await task.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign task', error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isCreator = task.creator.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isCreator) {
      return res.status(403).json({ message: 'Only the creator or an admin can delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};

module.exports = { getTasks, createTask, updateStatus, assignTask, deleteTask };