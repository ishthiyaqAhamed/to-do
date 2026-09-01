const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, requireRole('admin'), getUsers);

module.exports = router;